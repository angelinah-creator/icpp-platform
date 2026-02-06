import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "ICPP Conformité <dev@code-talent.fr>"

interface SendPasswordResetEmailParams {
    to: string
    resetUrl: string
    userName?: string
}

export async function sendPasswordResetEmail({
    to,
    resetUrl,
    userName,
}: SendPasswordResetEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: "Réinitialisation de votre mot de passe - ICPP",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">ICPP Conformité</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="margin: 0 0 16px 0; color: #18181b; font-size: 20px; font-weight: 600;">
                                Réinitialisation de mot de passe
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                                Bonjour${userName ? ` ${userName}` : ""},
                            </p>
                            
                            <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                                Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0 32px 0;">
                                        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                            </p>
                            
                            <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                                <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f4f4f5; padding: 24px 32px; text-align: center;">
                            <p style="margin: 0; color: #71717a; font-size: 12px;">
                                © 2026 ICPP Conformité. Tous droits réservés.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #a1a1aa; font-size: 12px;">
                                La Réunion, France
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        })

        if (error) {
            console.error("Resend error:", error)
            return { success: false, error: error.message }
        }

        console.log("Password reset email sent:", data)
        return { success: true, data }
    } catch (error) {
        console.error("Email sending error:", error)
        return { success: false, error: "Failed to send email" }
    }
}
