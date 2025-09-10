# SolmintX - Next Generation Oracle Finance System

## Overview

SolmintX is a cutting-edge financial platform that transforms global finance through blockchain technology and oracle systems. Our platform provides enterprise-grade security, lightning-fast transactions, and complete sovereignty over digital assets.

## Key Features

- **Real-Time Market Data**: Live streaming of global market prices, crypto assets, and forex pairs
- **Secure Asset Management**: Enterprise-grade security protocols for digital asset protection
- **Oracle Integration**: Advanced oracle system for reliable and accurate financial data
- **Smart Trading**: Automated trading features with advanced market analysis
- **Cross-Chain Compatibility**: Seamless integration with multiple blockchain networks
- **User-Centric Design**: Intuitive interface for both beginners and advanced traders

## Technology Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Market Data**: TradingView Integration
- **Authentication**: Web3 Wallet Integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Web3 wallet (MetaMask recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/A2DIGIHUB/solmintx.git

# Navigate to project directory
cd solmintx

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Admin Setup

### Creating the First Admin User

For security reasons, admin users can only be created through the Supabase Management Console or using the service role key. Follow these steps:

1. Go to your [Supabase Project Dashboard](https://app.supabase.com)
2. Navigate to SQL Editor
3. Run the following SQL commands:
   ```sql
   -- Create admin user in auth.users
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('admin@yourdomain.com', crypt('secure_password', gen_salt('bf')), now());

   -- Get the user's ID
   WITH user_id AS (
     SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com'
   )
   -- Create admin profile
   INSERT INTO public.profiles (id, email, full_name, role)
   SELECT id, 'admin@yourdomain.com', 'Admin User', 'admin'
   FROM user_id;
   ```

4. The admin can now log in at `/admin/login` with the specified credentials

### Security Notes

- Always use strong passwords for admin accounts
- Regularly audit admin access
- Enable two-factor authentication when possible
- Monitor admin activities through the security logs

## Project Structure

```
solmintx/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── public/           # Public assets
└── ...config files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

SolmintX implements multiple layers of security:
- Enterprise-grade encryption
- Multi-signature wallet support
- Regular security audits
- Real-time transaction monitoring

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [solmintx.com](https://solmintx.com)
- Email: support@solmintx.com
- Twitter: [@solmintx](https://twitter.com/solmintx)

## Acknowledgments

- TradingView for market data integration
- The global blockchain community
- Our dedicated team of developers and contributors
