# HubSpot Newsletter Integration Setup Guide

## Current Configuration

The newsletter form is already configured with the following HubSpot settings:
- **Portal ID**: 26510736
- **Form ID**: e92de02c-71b0-4a68-aedd-3b6acb0f5f67
- **Region**: EU1 (European data center)

## How the Integration Works

The newsletter signup uses a **dual approach** for maximum reliability:

1. **Primary Method**: Embedded HubSpot Form
   - The form loads directly from HubSpot's servers
   - Data is submitted directly to HubSpot
   - No API key required for this to work
   - Currently active and should be working

2. **Fallback Method**: API Integration
   - If the embedded form fails to load
   - Submits to `/api/newsletter` endpoint
   - Requires `HUBSPOT_ACCESS_TOKEN` for full integration
   - Currently works but without HubSpot integration

## To Complete the Setup

### Option 1: Use Embedded Form Only (Currently Active)
The embedded form should already be working. When users submit their email:
- It goes directly to HubSpot
- You can see submissions at: https://app-eu1.hubspot.com/contacts/26510736

### Option 2: Enable Full API Integration
To enable the backend API integration:

1. **Get your HubSpot Access Token**:
   - Go to: https://app-eu1.hubspot.com/settings/26510736/integrations/private-apps
   - Create a new private app
   - Name it: "Workflo Newsletter Integration"
   - Select these scopes:
     - `crm.objects.contacts.write`
     - `crm.objects.contacts.read`
     - `forms`
   - Generate the access token

2. **Add to Environment Variables**:
   ```bash
   # Edit your .env.local file
   HUBSPOT_ACCESS_TOKEN=your-access-token-here
   ```

3. **Restart your development server**

## Verify the Integration

### Check if Embedded Form is Working:
1. Go to your website
2. Find the newsletter signup form in the footer
3. Enter a test email address
4. Submit the form
5. Check HubSpot contacts: https://app-eu1.hubspot.com/contacts/26510736

### Check if API Integration is Working:
```bash
# Test the API endpoint
curl -X GET http://localhost:3000/api/newsletter
```

Should return:
```json
{
  "message": "Newsletter API is active",
  "timestamp": "...",
  "services": {
    "hubspot": true
  }
}
```

## Troubleshooting

### If the form doesn't appear:
- Check browser console for errors
- Ensure you're not blocking third-party scripts
- The form has a fallback to a simple HTML form if HubSpot fails to load

### If submissions aren't appearing in HubSpot:
- Verify the form ID is correct: `e92de02c-71b0-4a68-aedd-3b6acb0f5f67`
- Check if the form exists at: https://app-eu1.hubspot.com/forms/26510736
- Ensure you're checking the correct HubSpot portal

### If API integration isn't working:
- Verify `HUBSPOT_ACCESS_TOKEN` is set in `.env.local`
- Check the server logs for errors
- Ensure the access token has the correct permissions

## Current Status

✅ **Embedded Form**: Should be working (no API key needed)
⚠️ **API Integration**: Needs `HUBSPOT_ACCESS_TOKEN` to be set
✅ **Fallback Form**: Working (stores submissions locally if HubSpot fails)

## Next Steps

1. Test the current embedded form to see if it's already working
2. If you need API integration, get and add the HubSpot access token
3. Monitor submissions in HubSpot dashboard

## Support

For HubSpot support:
- Portal: https://app-eu1.hubspot.com/contacts/26510736
- Form Editor: https://app-eu1.hubspot.com/forms/26510736
- API Documentation: https://developers.hubspot.com/docs/api/forms/forms