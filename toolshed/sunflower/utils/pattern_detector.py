"""
Pattern detector for Sunflower application.
Detects predefined patterns in Neo4j graphs.
"""

from neo4j import GraphDatabase
from .pattern_library import PATTERNS

class PatternDetector:
    def __init__(self, uri, username, password):
        self.uri = uri
        self.username = username
        self.password = password
        self.driver = GraphDatabase.driver(uri, auth=(username, password))
    
    def close(self):
        if self.driver:
            self.driver.close()
    
    def detect_pattern(self, pattern_id):
        """
        Execute a specific pattern detection query
        """
        if pattern_id not in PATTERNS:
            return {
                "success": False,
                "message": f"Unknown pattern: {pattern_id}"
            }
        
        pattern = PATTERNS[pattern_id]
        
        try:
            # Add debug logging
            import logging
            logging.basicConfig(level=logging.INFO)
            logger = logging.getLogger(__name__)
            logger.info(f"Detecting pattern: {pattern_id}")
            
            with self.driver.session() as session:
                result = session.run(pattern.query)
                instances = []
                
                # For deduplication
                seen_ids = set()
                
                # Convert Neo4j objects to dictionaries
                record_count = 0
                for record in result:
                    record_count += 1
                    pattern_instance = record["pattern"]
                    
                    # Debug log each record
                    logger.info(f"Record {record_count} for pattern {pattern_id}: {pattern_instance}")
                    
                    # Generate a unique identifier regardless of pattern type
                    unique_id = None
                    
                    # Handle Actor objects specifically for director's inner circle
                    if pattern_id == "directors_inner_circle" and "collaborators" in pattern_instance:
                        # Generate a unique ID for this director
                        unique_id = str(pattern_instance["id"])
                        logger.info(f"Director's inner circle: Director ID = {unique_id}")
                        
                        # Skip if we've already seen this director
                        if unique_id in seen_ids:
                            logger.info(f"Skipping duplicate director: {pattern_instance.get('name', 'Unknown')}")
                            continue
                        seen_ids.add(unique_id)
                        
                        # Convert actor objects in collaborators list
                        collaborators = []
                        for collab in pattern_instance["collaborators"]:
                            actor_dict = dict(collab["actor"])
                            collaborators.append({
                                "actor": {
                                    "id": actor_dict.get("id") or collab["actor"].id,
                                    "name": actor_dict.get("name", "Unknown")
                                },
                                "collaborations": collab["collaborations"]
                            })
                        
                        instances.append({
                            "id": pattern_instance["id"],
                            "name": pattern_instance["name"],
                            "actorCount": pattern_instance["actorCount"],
                            "collaborators": collaborators
                        })
                    
                    # Handle actor collaborations pattern
                    elif pattern_id == "actor_collaborations":
                        # Create a unique ID from the two actor IDs
                        actor1_id = str(pattern_instance["actor1"].id)
                        actor2_id = str(pattern_instance["actor2"].id)
                        
                        # Sort the IDs to ensure consistent ordering
                        if actor1_id < actor2_id:
                            unique_id = f"{actor1_id}_{actor2_id}"
                        else:
                            unique_id = f"{actor2_id}_{actor1_id}"
                            
                        logger.info(f"Actor collaboration: Pair ID = {unique_id}")
                        
                        if unique_id in seen_ids:
                            logger.info(f"Skipping duplicate actor pair: {pattern_instance['actor1'].get('name', 'Unknown')} and {pattern_instance['actor2'].get('name', 'Unknown')}")
                            continue
                        seen_ids.add(unique_id)
                        
                        # Convert actor and movie objects
                        actor1 = dict(pattern_instance["actor1"])
                        actor2 = dict(pattern_instance["actor2"])
                        movies = []
                        
                        for movie in pattern_instance["movies"]:
                            movies.append(dict(movie))
                        
                        instances.append({
                            "actor1": {
                                "id": actor1.get("id", pattern_instance["actor1"].id),
                                "name": actor1.get("name", "Unknown")
                            },
                            "actor2": {
                                "id": actor2.get("id", pattern_instance["actor2"].id),
                                "name": actor2.get("name", "Unknown")
                            },
                            "movieCount": pattern_instance["movieCount"],
                            "movies": movies
                        })
                    
                    # Handle genre clusters
                    elif pattern_id == "genre_clusters":
                        # Get a unique identifier for the genre instance
                        unique_id = str(pattern_instance.get("name", ""))
                        logger.info(f"Genre cluster: Genre name = {unique_id}")
                        
                        if unique_id in seen_ids:
                            logger.info(f"Skipping duplicate genre: {unique_id}")
                            continue
                        seen_ids.add(unique_id)
                        
                        # Directly convert all properties
                        instances.append(dict(pattern_instance))
                    
                    # Default handling for any other pattern
                    else:
                        # Generate a more robust unique ID
                        try:
                            # Try to use id field if available
                            if hasattr(pattern_instance, "id") or (isinstance(pattern_instance, dict) and "id" in pattern_instance):
                                unique_id = str(pattern_instance.get("id", pattern_instance["id"]))
                            else:
                                # Fall back to hashing the string representation
                                unique_id = str(hash(str(pattern_instance)))
                            
                            logger.info(f"Other pattern: Generated ID = {unique_id}")
                            
                            if unique_id in seen_ids:
                                logger.info(f"Skipping duplicate pattern instance with ID: {unique_id}")
                                continue
                            seen_ids.add(unique_id)
                        except Exception as e:
                            logger.error(f"Error generating unique ID: {str(e)}")
                            # If we can't deduplicate, still include the instance
                            logger.info("Including instance without deduplication")
                        
                        instances.append(dict(pattern_instance))
                
                # Log summary information
                logger.info(f"Found {len(instances)} unique instances for pattern {pattern_id}")
                logger.info(f"Processed {record_count} total records")
                
                return {
                    "success": True,
                    "pattern": {
                        "id": pattern.id,
                        "name": pattern.name,
                        "description": pattern.description,
                        "count": len(instances),
                        "instances": instances
                    }
                }
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "message": f"Error detecting pattern: {str(e)}"
            }
    
    def detect_all_patterns(self):
        """
        Execute all pattern detection queries
        
        Returns:
        --------
        dict:
            All patterns with their detected instances
        """
        import logging
        logger = logging.getLogger(__name__)
        logger.info("Detecting all patterns")
        
        results = {}
        
        for pattern_id in PATTERNS:
            logger.info(f"Detecting pattern: {pattern_id}")
            result = self.detect_pattern(pattern_id)
            if result["success"]:
                results[pattern_id] = result["pattern"]
                logger.info(f"Successfully detected {result['pattern']['count']} instances of pattern {pattern_id}")
            else:
                results[pattern_id] = {
                    "id": pattern_id,
                    "name": PATTERNS[pattern_id].name,
                    "description": PATTERNS[pattern_id].description,
                    "count": 0,
                    "instances": [],
                    "error": result["message"]
                }
                logger.error(f"Error detecting pattern {pattern_id}: {result['message']}")
        
        return results
    
    def get_pattern_visualization_data(self, pattern_id, instance_id):
        """
        Get data for visualizing a specific pattern instance
        
        Parameters:
        -----------
        pattern_id: str
            The ID of the pattern
        instance_id: str
            The ID of the specific instance
            
        Returns:
        --------
        dict:
            Nodes and relationships for visualization
        """
        if pattern_id not in PATTERNS:
            return {"success": False, "message": "Unknown pattern"}
        
        try:
            with self.driver.session() as session:
                if pattern_id == "directors_inner_circle":
                    query = """
                        MATCH (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
                        WHERE id(d) = $id
                        WITH d, m, a
                        LIMIT 50
                        RETURN d, m, a
                    """
                    result = session.run(query, id=int(instance_id))
                    
                    nodes = {}
                    links = []
                    
                    for record in result:
                        # Add director node
                        d = record["d"]
                        if str(d.id) not in nodes:
                            nodes[str(d.id)] = {
                                "id": str(d.id),
                                "labels": list(d.labels),
                                "properties": dict(d),
                                "role": "director"
                            }
                        
                        # Add movie node
                        m = record["m"]
                        if str(m.id) not in nodes:
                            nodes[str(m.id)] = {
                                "id": str(m.id),
                                "labels": list(m.labels),
                                "properties": dict(m),
                                "role": "movie"
                            }
                        
                        # Add actor node
                        a = record["a"]
                        if str(a.id) not in nodes:
                            nodes[str(a.id)] = {
                                "id": str(a.id),
                                "labels": list(a.labels),
                                "properties": dict(a),
                                "role": "actor"
                            }
                        
                        # Add links
                        links.append({
                            "source": str(d.id),
                            "target": str(m.id),
                            "type": "DIRECTED"
                        })
                        links.append({
                            "source": str(a.id),
                            "target": str(m.id),
                            "type": "ACTED_IN"
                        })
                    
                    return {
                        "success": True,
                        "data": {
                            "nodes": list(nodes.values()),
                            "links": links
                        }
                    }
                
                elif pattern_id == "actor_collaborations":
                    # Parse actor IDs from instance_id (format: "actor1Id_actor2Id")
                    actor_ids = instance_id.split('_')
                    if len(actor_ids) != 2:
                        return {"success": False, "message": "Invalid instance ID format"}
                    
                    actor1_id = int(actor_ids[0])
                    actor2_id = int(actor_ids[1])
                    
                    query = """
                        MATCH (a1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a2:Person)
                        WHERE id(a1) = $actor1Id AND id(a2) = $actor2Id
                        RETURN a1, a2, m
                    """
                    result = session.run(query, actor1Id=actor1_id, actor2Id=actor2_id)
                    
                    nodes = {}
                    links = []
                    
                    for record in result:
                        # Add actor nodes
                        a1 = record["a1"]
                        if str(a1.id) not in nodes:
                            nodes[str(a1.id)] = {
                                "id": str(a1.id),
                                "labels": list(a1.labels),
                                "properties": dict(a1),
                                "role": "actor1"
                            }
                        
                        a2 = record["a2"]
                        if str(a2.id) not in nodes:
                            nodes[str(a2.id)] = {
                                "id": str(a2.id),
                                "labels": list(a2.labels),
                                "properties": dict(a2),
                                "role": "actor2"
                            }
                        
                        # Add movie node
                        m = record["m"]
                        if str(m.id) not in nodes:
                            nodes[str(m.id)] = {
                                "id": str(m.id),
                                "labels": list(m.labels),
                                "properties": dict(m),
                                "role": "movie"
                            }
                        
                        # Add links
                        links.append({
                            "source": str(a1.id),
                            "target": str(m.id),
                            "type": "ACTED_IN"
                        })
                        links.append({
                            "source": str(a2.id),
                            "target": str(m.id),
                            "type": "ACTED_IN"
                        })
                    
                    return {
                        "success": True,
                        "data": {
                            "nodes": list(nodes.values()),
                            "links": links
                        }
                    }
                
                elif pattern_id == "genre_clusters":
                    # Parse genre from instance_id
                    genre = instance_id
                    
                    # Create a central genre node
                    genre_id = "genre_" + genre
                    nodes = {
                        genre_id: {
                            "id": genre_id,
                            "labels": ["Genre"],
                            "properties": {"name": genre + " Genre"},
                            "role": "genre"
                        }
                    }
                    links = []
                    
                    # Find actors who specialize in this genre
                    query = """
                        MATCH (a:Person)-[:ACTED_IN]->(m:Movie)
                        WITH a, m
                        WHERE toLower(m.tagline) CONTAINS toLower($genre)
                        WITH a, collect(m) as movies
                        WHERE size(movies) >= 1
                        RETURN a, movies
                        LIMIT 30
                    """
                    
                    result = session.run(query, genre=genre.lower())
                    
                    for record in result:
                        actor = record["a"]
                        movies = record["movies"]
                        actor_id = str(actor.id)
                        
                        # Add actor node
                        if actor_id not in nodes:
                            nodes[actor_id] = {
                                "id": actor_id,
                                "labels": list(actor.labels),
                                "properties": dict(actor),
                                "role": "actor"
                            }
                            
                            # Link actor to genre
                            links.append({
                                "source": actor_id,
                                "target": genre_id,
                                "type": "SPECIALIZES_IN",
                                "properties": {"count": len(movies)}
                            })
                        
                        # Add up to 3 sample movies for this actor in this genre
                        for i, movie in enumerate(movies[:3]):
                            movie_id = str(movie.id)
                            
                            # Add movie node if not already added
                            if movie_id not in nodes:
                                nodes[movie_id] = {
                                    "id": movie_id,
                                    "labels": list(movie.labels),
                                    "properties": dict(movie),
                                    "role": "movie"
                                }
                                
                                # Link movie to genre
                                links.append({
                                    "source": movie_id,
                                    "target": genre_id,
                                    "type": "IN_GENRE",
                                    "properties": {}
                                })
                            
                            # Link actor to movie
                            links.append({
                                "source": actor_id,
                                "target": movie_id,
                                "type": "ACTED_IN",
                                "properties": {}
                            })
                    
                    return {
                        "success": True,
                        "data": {
                            "nodes": list(nodes.values()),
                            "links": links
                        }
                    }
                
                else:
                    return {"success": False, "message": "Visualization not implemented for this pattern"}
                    
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {"success": False, "message": f"Error: {str(e)}"}
