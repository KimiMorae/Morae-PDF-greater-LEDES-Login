# LEDES Utility

A modern web application for converting PDF invoices to LEDES (Legal Electronic Data Exchange Standard) format. Built with React, TypeScript, and Vite for fast and efficient legal billing data processing.

## Features

- **PDF to LEDES Conversion**: Convert legal billing PDFs to standardized LEDES format
- **Batch Processing**: Upload and process multiple files simultaneously (up to 20 files)
- **Real-time Progress Tracking**: Monitor conversion progress with live status updates
- **Secure Authentication**: OAuth-based login system with token refresh
- **File Management**: Download original files and processed LEDES ZIP packages
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Drag & Drop Interface**: Intuitive file upload with drag-and-drop support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite 5
- **UI Components**: Radix UI, Lucide React icons
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **Authentication**: JWT tokens with refresh mechanism
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Morae-PDF-greater-LEDES-Login
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_api_base_url_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useUserProfile.ts
│   └── use-*.ts        # Other utility hooks
├── lib/                # Utility libraries
│   ├── api.ts          # API client and functions
│   ├── queryClient.ts  # React Query configuration
│   └── utils.ts        # General utilities
├── pages/              # Page components
│   ├── Home.tsx        # Main application page
│   ├── Login.tsx       # Authentication page
│   └── not-found.tsx   # 404 page
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Usage

### Single File Conversion

1. Log in with your credentials
2. Upload a single PDF file via drag-and-drop or file browser
3. Click "Convert to LEDES" to start processing
4. Download the converted LEDES file once processing is complete

### Batch Processing

1. Select multiple PDF files (up to 20)
2. Click "Convert All to LEDES" to process all files
3. Monitor progress for each file individually
4. Download original files or processed LEDES ZIP packages

### File Management

- **Search**: Use the search bar to find specific files by upload reference
- **Download Options**: 
  - Original File: Download the original PDF
  - LEDES ZIP: Download processed LEDES files in ZIP format

## API Integration

The application integrates with a backend API for:

- User authentication and token management
- File upload and processing
- Invoice data extraction
- Metadata extraction
- LEDES report generation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via IDE)
- Tailwind CSS for styling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
