# StartupConnect

A modern Tinder-like platform that connects startup founders with talented professionals looking for their next opportunity.

## Features

### 🚀 For Job Seekers (Employees)
- **Swipe Interface**: Discover startups with a familiar swipe-based interface
- **Smart Matching**: Only see general startup information to prevent idea theft
- **Instant Connections**: Match with startups that align with your interests
- **Profile Management**: Showcase your skills and experience

### 💼 For Founders
- **Talent Discovery**: Find skilled professionals for your startup
- **Protected Ideas**: Share public summaries while keeping detailed descriptions private
- **Mutual Matching**: Connect only when there's mutual interest
- **Team Building**: Find the right people for specific roles

### 🎯 Key Features
- **Privacy First**: Startup ideas remain hidden until mutual match
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Matching**: Instant feedback on swipes and matches
- **Mobile-Friendly**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Heroicons
- **State Management**: React Context API
- **Storage**: localStorage (demo purposes)
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd startup-connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Demo Accounts

Try the application with these demo accounts:

### Employee Demo
- **Email**: alice@example.com
- **Password**: demo123
- **Profile**: Full-stack developer with React and Node.js experience

### Founder Demo
- **Email**: sarah@ecotech.com
- **Password**: demo123
- **Profile**: Founder of EcoTech Solutions (Climate Tech)

## How It Works

### For Employees:
1. **Sign up** or use demo login
2. **Discover** startups by swiping through cards
3. **Swipe right** to like interesting opportunities
4. **Match** when both you and the founder are interested
5. **Connect** and start conversations

### For Founders:
1. **Create account** and add startup information
2. **Set up** public summary (visible to all) and private details (visible after match)
3. **Review** candidates who liked your startup
4. **Match** with promising candidates
5. **Connect** to discuss opportunities

## Key Components

- **StartupCard**: Tinder-like swipeable card component
- **SwipeInterface**: Main discovery interface with card stack
- **AuthContext**: User authentication and state management
- **Login/Signup**: Beautiful authentication forms
- **Matches**: View and manage mutual connections

## Project Structure

```
src/
├── components/          # React components
│   ├── StartupCard.tsx  # Swipeable startup card
│   ├── SwipeInterface.tsx # Main swipe interface
│   ├── Login.tsx        # Login form
│   └── Signup.tsx       # Registration form
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── types/               # TypeScript interfaces
│   └── index.ts         # Type definitions
├── data/                # Sample data
│   └── sampleData.ts    # Mock startup and user data
└── App.tsx              # Main application component
```

## Features Overview

### 🎨 User Interface
- Modern gradient backgrounds
- Smooth card animations
- Responsive design
- Glass morphism effects
- Interactive hover states

### 🔐 Authentication
- User registration and login
- Demo account access
- Profile management
- Session persistence

### 💫 Swipe Mechanics
- Drag and drop support
- Touch gestures for mobile
- Visual feedback during swipes
- Undo functionality
- Progress tracking

### 🤝 Matching System
- Like/pass actions
- Mutual match detection
- Match history
- Real-time updates

## Customization

### Adding New Industries
Update the `Industry` type in `src/types/index.ts`:

```typescript
export type Industry = 
  | 'tech' 
  | 'fintech' 
  | 'your-new-industry'
  // ... other industries
```

### Modifying Card Design
Edit `src/components/StartupCard.tsx` to customize:
- Color schemes
- Layout structure
- Information displayed
- Animation effects

### Extending User Profiles
Add new fields to the `User` interface in `src/types/index.ts`:

```typescript
export interface User {
  // ... existing fields
  yourNewField?: string;
}
```

## Future Enhancements

- [ ] Real backend integration
- [ ] Chat messaging system
- [ ] Video call integration
- [ ] Advanced filtering options
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered matching
- [ ] Company verification system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**StartupConnect** - Where innovation meets talent. 🚀
