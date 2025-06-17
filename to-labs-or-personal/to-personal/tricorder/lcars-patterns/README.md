# LCARS Patterns Library

This directory consolidates all LCARS design patterns and implementations from across the GARDEN ecosystem.

## Pattern Sources

### 1. Scott's Enhanced Tricorder (Production)
- **Location**: `scott-enhanced-tricorder.html`
- **Status**: Live production system
- **Features**: Complete LCARS interface, advanced parsing, mobile responsive
- **Color Scheme**: Orange/Blue/Purple/Red with authentic LCARS styling

### 2. Dan's Captain's Log (Reference)
- **Location**: `dan-captains-log-reference.html`
- **Status**: Reference implementation from stealth project
- **Features**: Voice integration placeholders, simplified layout
- **Color Scheme**: Classic LCARS with different accent colors

### 3. Generic LCARS Framework (Library)
- **Location**: `lcars-base-components/`
- **Status**: Base framework from third-party LCARS library
- **Features**: Core CSS components and styling patterns

## Usage Guidelines

### For Scott's Tricorder Enhancement
- Use patterns from `scott-enhanced-tricorder.html` as primary reference
- Adapt Dan's patterns for voice integration features
- Reference base components for additional UI elements

### For Dan's Future Captain's Log
- Extract patterns from `dan-captains-log-reference.html`
- Enhance with Scott's advanced parsing capabilities
- Maintain Dan's preferred color scheme and layout

### For Zach's Future Tools
- Use base components as starting point
- Adapt color schemes for different tool contexts
- Reference both implementations for best practices

## Pattern Categories

### Layout Patterns
- Grid-based LCARS interface structure
- Responsive mobile adaptations
- Panel and section organization

### Color Schemes
- Scott's production colors (Orange #FF9900, Blue #0066CC)
- Dan's reference colors (Orange #FF9900, Blue #9999FF)
- Base LCARS standard colors

### Interactive Elements
- Button styles and hover effects
- Modal dialogs and overlays
- Form inputs and text areas

### Typography
- Orbitron font integration
- Letter spacing and font weights
- Size hierarchies for different contexts

## Implementation Notes
- All patterns use zero external dependencies
- CSS Grid for responsive layouts
- CSS custom properties for theming
- Mobile-first responsive design
- Authentic LCARS aesthetic principles