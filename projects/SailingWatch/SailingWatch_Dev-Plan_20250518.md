# SailingWatch Development Plan - Week 1

## Setup Phase (Days 1-2)

### Development Environment Setup
- [ ] Install Xcode from the Mac App Store (latest version)
- [ ] Create or sign in to Apple Developer account
- [ ] Configure Xcode with your developer account
- [ ] Pair your Apple Watch with Xcode for testing
- [ ] Install Git for version control
- [ ] Create GitHub account (if you don't have one already)

### Resource Collection
- [ ] Bookmark Apple's [WatchKit Documentation](https://developer.apple.com/documentation/watchkit)
- [ ] Bookmark [CoreLocation Documentation](https://developer.apple.com/documentation/corelocation)
- [ ] Bookmark [SwiftUI for watchOS Documentation](https://developer.apple.com/documentation/watchos-apps/views-and-controls)
- [ ] Download WWDC videos on watchOS development
- [ ] Join r/watchOSdevelopment subreddit for community support

## Open Source Project Exploration (Days 3-4)

### Project Selection Criteria
- Active maintenance or recent updates
- watchOS compatibility
- GPS/location tracking functionality
- MIT or Apache license preferred
- Clear code organization

### Candidate Projects to Evaluate
1. **GPX Tracker** - GPS tracking for outdoor activities
   - GitHub: https://github.com/merlos/iOS-Open-GPX-Tracker
   - Key features: GPS tracking, route recording, Apple Watch app

2. **WorkoutKit** - Fitness tracking framework with Apple Watch support
   - GitHub: https://github.com/MacPaw/WorkoutKit
   - Key features: Location tracking, activity monitoring, watchOS integration

3. **SwiftLocation** - Easy location manager for iOS
   - GitHub: https://github.com/malcommac/SwiftLocation
   - Key features: Simplified location API, heading tracking, background updates

### Selection Process
- [ ] Clone each repository
- [ ] Review code structure and documentation
- [ ] Build and run on simulator
- [ ] Test on actual Apple Watch
- [ ] Evaluate simplicity and potential for modification
- [ ] Select project with best foundation for our needs

## Initial Modifications (Days 5-7)

### Project Setup
- [ ] Fork selected repository to your GitHub account
- [ ] Clone to local machine
- [ ] Create development branch
- [ ] Ensure it builds and runs correctly

### First Modifications
- [ ] Identify code responsible for location tracking
- [ ] Add logging to understand location update flow
- [ ] Modify UI to focus on heading information
- [ ] Test sampling rates for location updates
- [ ] Implement simple algorithm to calculate heading from successive GPS points

### Learning Tasks
- [ ] Understand watchOS app lifecycle
- [ ] Learn about complications and their refresh rates
- [ ] Study CoreLocation capabilities and limitations on watchOS
- [ ] Explore background execution constraints

## End of Week Milestone
- Running fork of open-source app on your Apple Watch
- Basic understanding of the codebase
- Simple modifications to show location and heading
- Plan for implementing trajectory-based heading in Week 2

## Resources

### Documentation
- [Apple Developer - watchOS](https://developer.apple.com/watchos/)
- [CoreLocation Framework](https://developer.apple.com/documentation/corelocation)
- [WatchKit Framework](https://developer.apple.com/documentation/watchkit)

### Tutorials
- [Ray Wenderlich - watchOS Tutorials](https://www.raywenderlich.com/library?domain_ids%5B%5D=1&content_types%5B%5D=tutorial)
- [Hacking with Swift - watchOS Projects](https://www.hackingwithswift.com/watchos)

### Community Support
- [Stack Overflow - watchOS Tag](https://stackoverflow.com/questions/tagged/watchos)
- [Apple Developer Forums - watchOS](https://developer.apple.com/forums/tags/watchos)

### Heading Calculation Resources
- [Calculate Bearing Between Coordinates](https://www.movable-type.co.uk/scripts/latlong.html)
- [Trajectory Smoothing Algorithms](https://medium.com/analytics-vidhya/trajectory-smoothing-algorithms-65e22af2a486)

## Next Steps for Week 2
- Implement trajectory-based heading algorithm
- Create simple complication for heading display
- Begin weather API integration research
- Test on-water performance