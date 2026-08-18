# PlayBeat Digital Admin Panel Setup Guide

## Admin Panel Access

The admin panel is now fully functional with environment-based credentials.

### Admin Login Credentials

- **URL**: Visit the app and navigate to `/adminpanel`
- **Username/Email**: Any value (field is for reference)
- **Master Password**: `PlayBeat@AdminPanel2026`

### Environment Variables Configuration

All sensitive credentials are now managed via `.env` file (DO NOT commit to GitHub):

```env
# Admin Panel Security
REACT_APP_ADMIN_PASSWORD=PlayBeat@AdminPanel2026

# IPTV Service Credentials  
REACT_APP_IPTV_PASSWORD=iptv_secure_password_here

# JazzCash Payment Gateway
REACT_APP_JAZZCASH_MERCHANT_ID=MC123456789
REACT_APP_JAZZCASH_PASSWORD=jazzcash_api_password_here
REACT_APP_JAZZCASH_INTEGRITY_SALT=jazzcash_salt_value_here
```

### Admin Panel Features

Once logged in, you have access to:

1. **Dashboard** - Overview of sales, revenue, and analytics
2. **Analytics** - Detailed performance metrics
3. **Products** - Manage product catalog
4. **Orders** - View and manage customer orders
5. **WooCommerce** - Sync with WooCommerce store
6. **Subscriptions** - Manage subscription services
7. **Coupons** - Create and manage discount codes
8. **Users** - Manage customer accounts
9. **Support** - Handle customer support tickets
10. **IPTV** - Manage IPTV streaming credentials
11. **Finance** - Track financial metrics
12. **Payment Gateways** - Configure payment methods
13. **Payment Proof** - Verify payment confirmations
14. **Social Media** - Manage social media integration
15. **TikTok Leads** - Manage TikTok-generated leads
16. **Email** - Configure email templates
17. **JazzCash** - Configure JazzCash payment settings
18. **Reports** - Generate custom reports

### Security Best Practices

- ✅ All credentials are environment-based (no hardcoding)
- ✅ Master password should be changed in production
- ✅ Use strong, unique passwords for each service
- ✅ Store `.env` file in secure location only (DO NOT commit)
- ✅ Enable 2FA on all linked services

### Deployment Instructions

1. Create `.env` file with production credentials (don't use defaults)
2. Build the app: `npm run build`
3. Deploy dist folder to your server
4. Set environment variables on hosting platform
5. Verify admin login works before going live

### Troubleshooting

**Admin login not working?**
- Check `.env` file exists with `REACT_APP_ADMIN_PASSWORD` set
- Verify password matches exactly (case-sensitive)
- Clear browser cache/cookies and try again
- Check browser console for any errors

**Environment variables not loading?**
- Restart dev server after changing `.env`
- Rebuild app if deploying: `npm run build`
- Check hosting platform's environment variables section

---

**Last Updated**: 2026-08-18  
**Version**: 1.0.0
