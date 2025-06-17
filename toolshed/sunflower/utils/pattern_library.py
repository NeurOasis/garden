"""
Pattern library for Sunflower application.
Defines standard structural patterns to detect in Neo4j graphs.
"""

class Pattern:
    def __init__(self, id, name, description, query, visualization_type="graph"):
        self.id = id
        self.name = name
        self.description = description
        self.query = query
        self.visualization_type = visualization_type  # graph, heatmap, etc.

# Collection of predefined patterns
PATTERNS = {
    "directors_inner_circle": Pattern(
        id="directors_inner_circle",
        name="Director's Inner Circle",
        description="Directors who frequently work with the same group of actors across multiple films",
        query="""
            MATCH (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
            WITH d, count(DISTINCT a) as actorCount, collect(DISTINCT a) as actors
            WHERE actorCount >= 3
            WITH d, actors, actorCount
            MATCH (m:Movie)
            WHERE (d)-[:DIRECTED]->(m)
            WITH d, actors, count(m) as movieCount, actorCount
            WHERE movieCount >= 2
            
            // Get collaborations with these actors
            MATCH (a:Person)-[:ACTED_IN]->(m:Movie)<-[:DIRECTED]-(d)
            WHERE a IN actors
            WITH d, a, count(m) as collaborationCount
            WHERE collaborationCount >= 2
            
            // Group by director to find inner circles
            WITH d, collect({actor: a, collaborations: collaborationCount}) as collaborators
            WHERE size(collaborators) >= 3
            
            RETURN {
                id: id(d),
                name: d.name,
                actorCount: size(collaborators),
                collaborators: collaborators
            } as pattern
            ORDER BY size(collaborators) DESC
            LIMIT 10
        """
    ),
    
    "actor_collaborations": Pattern(
        id="actor_collaborations",
        name="Frequent Actor Collaborations",
        description="Pairs of actors who frequently appear in films together",
        query="""
            MATCH (a1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a2:Person)
            WHERE a1 <> a2 AND id(a1) < id(a2)  // Avoid duplicates
            WITH a1, a2, count(m) as movieCount, collect(m) as movies
            WHERE movieCount >= 3  // They've appeared in at least 3 movies together
            
            RETURN {
                actor1: {id: id(a1), name: a1.name},
                actor2: {id: id(a2), name: a2.name},
                movieCount: movieCount,
                movies: [movie IN movies | {title: movie.title, released: movie.released}]
            } as pattern
            ORDER BY movieCount DESC
            LIMIT 10
        """
    ),
    
    "genre_clusters": Pattern(
        id="genre_clusters",
        name="Genre Communities",
        description="Groups of actors who tend to work in the same film genres",
        query="""
            // Simplified version - would be enhanced with actual genre data
            MATCH (a:Person)-[:ACTED_IN]->(m:Movie)
            WITH a, count(m) as movieCount
            WHERE movieCount >= 5
            MATCH (a)-[:ACTED_IN]->(m:Movie)
            WITH a, m
            
            // Use taglines for genre approximation since movies dataset might not have genre
            WITH a.name as actor, 
                 CASE 
                    WHEN toLower(m.tagline) CONTAINS "love" THEN "Romance"
                    WHEN toLower(m.tagline) CONTAINS "adventure" THEN "Adventure"
                    WHEN toLower(m.tagline) CONTAINS "war" THEN "War"
                    WHEN toLower(m.tagline) CONTAINS "crime" THEN "Crime"
                    WHEN toLower(m.tagline) CONTAINS "comedy" THEN "Comedy"
                    WHEN toLower(m.tagline) CONTAINS "drama" THEN "Drama"
                    ELSE "Other"
                 END as genre,
                 count(*) as count
            WHERE genre <> "Other"
            WITH actor, genre, count
            ORDER BY count DESC
            WITH actor, collect({genre: genre, count: count})[0] as topGenre
            
            // Group by top genre
            WITH topGenre.genre as genre, collect({actor: actor, count: topGenre.count}) as actors
            
            RETURN {
                genre: genre,
                actorCount: size(actors),
                topActors: actors[..5]
            } as pattern
            ORDER BY size(actors) DESC
            LIMIT 5
        """
    )
}

