export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Welcome to Invisly</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset and base */
        html,body{margin:0;padding:0;height:100%}
        img{border:0;display:block;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
        a{color:inherit}
        table{border-collapse:collapse}

        /* Variables */
        :root{
            --bg:#0b0b0c;
            --card:#141415;
            --muted:#9ca3af;
            --accent:#FDD458;
            --accent-dark:#E8BA40;
            --card-border:#30333A;
            --text:#CCDADC;
            --title:#FFFFFF;
        }

        /* Container */
        .email-outer{width:100%;background-color:var(--bg);padding:40px 20px}
        .email-card{max-width:640px;margin:0 auto;background:var(--card);border:1px solid var(--card-border);border-radius:12px;overflow:hidden}

        /* Header */
        .header{display:flex;align-items:center;gap:16px;padding:28px 32px}
        .brand-logo{width:48px;height:48px;border-radius:8px;background:#000;overflow:hidden}
        .brand-title{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; font-size:18px;font-weight:700;color:var(--title);margin:0}

        /* Hero preview */
        .hero{padding:0 32px 0 32px;background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent)}
        .hero img{width:100%;max-width:576px;border-radius:12px;border:1px solid var(--card-border)}

        /* Content */
        .content{padding:32px}
        .h1{font-size:22px;line-height:1.2;margin:0 0 18px;font-weight:700;color:var(--accent)}
        .lead{font-size:16px;color:var(--text);margin:0 0 20px;line-height:1.6}
        .muted{color:var(--muted);font-weight:600}
        ul.features{padding-left:20px;margin:0 0 20px 0;color:var(--text);font-size:16px;line-height:1.6}
        ul.features li{margin-bottom:12px}

        /* CTA */
        .cta-wrap{padding:12px 0}
        .btn{display:inline-block;padding:14px 26px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:#000;box-shadow:0 6px 18px rgba(245,190,61,0.12)}

        /* Footer */
        .footer{padding:20px 32px 36px 32px;text-align:center;color:var(--text);font-size:14px}

        /* Mobile */
        @media only screen and (max-width:600px){
            .header{padding:20px}
            .hero{padding:0 20px}
            .content{padding:20px}
            .h1{font-size:20px}
            .btn{width:100%;display:block;text-align:center}
        }

        /* Dark mode (email clients that support prefers-color-scheme) */
        @media (prefers-color-scheme: dark){
            :root{--bg:#050505;--card:#0f0f10;--card-border:#25272a;--text:#d1d8de}
        }

        /* Outlook safe fallbacks */
        @media all and (min-width:0){
            .ExternalClass .header,.ExternalClass .content{width:100%}
        }
    </style>
</head>
<body style="background-color:var(--bg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <!-- Preheader (hidden) -->
    <span style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Welcome to Invisly — set up your watchlist and start tracking the market.</span>

    <table role="presentation" width="100%" class="email-outer">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" class="email-card">

                    <!-- Header -->
                    <tr>
                        <td>
                            <div class="header">
                                <div class="brand-logo" aria-hidden="true">
                                    <img src="https://ik.imagekit.io/fhqszmxxl/Invsily_logo.png?updatedAt=1763085694996" alt="Invisly logo" width="48" style="display:block;max-width:48px;height:48px;border-radius:8px;">
                                </div>
                                <div>
                                    <p class="brand-title">Invisly.ai</p>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Dashboard Preview Image -->
                    <tr>
                        <td class="hero" align="center">
                            <img src="https://ik.imagekit.io/fhqszmxxl/Invisly_dashboard.png?updatedAt=1763085418473" alt="Invisly Dashboard Preview" width="576" style="max-width:576px;height:auto;">
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="content">
                            <h1 class="h1">Welcome aboard {{name}}</h1>

                            <p class="lead">{{intro}}</p>

                            <p class="muted" style="margin:0 0 12px 0">Here's what you can do right now:</p>

                            <ul class="features" role="list">
                                <li>Set up your watchlist to follow your favorite stocks</li>
                                <li>Create price and volume alerts so you never miss a move</li>
                                <li>Explore the dashboard for trends and the latest market news</li>
                            </ul>

                            <p class="lead" style="margin-bottom:18px">We'll keep you informed with timely updates, insights, and alerts — so you can focus on making the right calls.</p>

                            <div class="cta-wrap" align="center">
                                <a href=${process.env.PROD_URL ? process.env.PROD_URL : ''} class="btn" role="button" aria-label="Go to Dashboard">Go to Dashboard</a>
                            </div>

                            <div class="footer">© 2025 Invisly</div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;