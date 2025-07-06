# AutoEDM - AI-Powered Email Content Generator

A responsive React web application that helps marketing users generate and preview personalized email content using OpenAI's GPT API.

## Features

- **Customer Information Form**: Collect customer name, favorite shopping category, and recent purchase details
- **AI-Powered Greeting Generation**: Uses OpenAI GPT-3.5-turbo to create personalized email greetings
- **Email Preview**: Displays AI-generated content with modular category blocks
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Copy to Clipboard**: Easy content copying for use in email platforms

## Tech Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- OpenAI API for content generation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in the root directory:

```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Start the Development Server

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Fill out the customer form**:
   - Enter the customer's name (optional)
   - Select their favorite shopping category (required)
   - Add their recent purchase (optional)

2. **Generate email content**:
   - Click "Generate Email Copy" to create a personalized greeting using AI
   - The system will call OpenAI's API to generate contextually relevant content

3. **Preview and copy**:
   - Review the AI-generated greeting
   - See the category content blocks with the favorite category highlighted
   - Use "Copy Email Content" to copy the full content to your clipboard

## Project Structure

```
src/
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
├── index.css        # Tailwind CSS imports
└── ...
```

## API Configuration

The application uses OpenAI's GPT-3.5-turbo model for generating personalized email greetings. The prompt is designed to:

- Use the customer's name when provided
- Reference their favorite shopping category
- Mention recent purchases when available
- Create friendly, conversational content
- Generate 2-3 sentence greetings

## Styling

The application uses Tailwind CSS with:
- Responsive grid layouts
- Modern card-based design
- Consistent color scheme (indigo/blue theme)
- Smooth transitions and hover effects
- Mobile-first responsive design

## Future Enhancements

This is Phase 1 of the AutoEDM prototype. Future phases may include:
- Backend integration for email sending
- Multi-channel delivery (SMS, push notifications)
- Advanced personalization algorithms
- A/B testing capabilities
- Analytics and performance tracking

## Security Notes

- The OpenAI API key is currently exposed in the frontend for demo purposes
- In production, API calls should be routed through a backend service
- Consider implementing rate limiting and user authentication

## Troubleshooting

### Common Issues

1. **"Failed to generate email copy" error**:
   - Check that your OpenAI API key is correctly set in the `.env` file
   - Ensure you have sufficient API credits
   - Verify your internet connection

2. **Tailwind CSS not working**:
   - Run `npm install` to ensure all dependencies are installed
   - Check that `tailwind.config.js` includes the correct content paths

3. **Build errors**:
   - Clear the build cache: `npm run build -- --reset-cache`
   - Delete `node_modules` and run `npm install` again

## License

This project is for demonstration purposes. Please ensure compliance with OpenAI's usage policies and terms of service.
