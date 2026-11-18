function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function buildDemoRequestEmail(values) {
  const name = escapeHtml(values.name);
  const business = escapeHtml(values.business);
  const email = escapeHtml(values.email);
  const industry = escapeHtml(values.industry);
  const message = escapeHtml(values.message).replace(/\r?\n/g, '<br>');

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nueva solicitud · YUPPI</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1faf4;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="display:none;font-size:1px;line-height:1px;color:#f1faf4;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      Nueva solicitud de demostración de ${name} para ${business}.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#f1faf4;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e1eee5;border-radius:16px;">
            <tr>
              <td style="padding:26px 30px 22px;border-bottom:1px solid #e8f0eb;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding-right:12px;">
                      <img src="cid:yuppi-logo" width="52" height="48" alt="YUPPI" style="display:block;width:52px;height:48px;border:0;outline:none;text-decoration:none;">
                    </td>
                    <td valign="middle" style="font-size:25px;line-height:30px;font-weight:800;letter-spacing:-1px;color:#172033;">
                      YU<span style="color:#0bb7a5;">PP</span><span style="color:#172033;">I</span>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 5px;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.5px;color:#078b6d;text-transform:uppercase;">Contacto comercial</p>
                <h1 style="margin:0;font-size:24px;line-height:31px;font-weight:700;color:#172033;">Nueva solicitud de demostración</h1>
                <p style="margin:8px 0 0;font-size:14px;line-height:21px;color:#5d7064;">Una persona quiere conversar sobre cómo mejorar su operación.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 30px 30px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #e1eee5;border-radius:12px;border-collapse:separate;">
                  <tr><td style="padding:15px 17px;border-bottom:1px solid #e8f0eb;">
                    <p style="margin:0 0 5px;font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;color:#718278;text-transform:uppercase;">Nombre</p>
                    <p style="margin:0;font-size:15px;line-height:22px;font-weight:600;color:#172033;">${name}</p>
                  </td></tr>
                  <tr><td style="padding:15px 17px;border-bottom:1px solid #e8f0eb;">
                    <p style="margin:0 0 5px;font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;color:#718278;text-transform:uppercase;">Negocio</p>
                    <p style="margin:0;font-size:15px;line-height:22px;color:#172033;">${business}</p>
                  </td></tr>
                  <tr><td style="padding:15px 17px;border-bottom:1px solid #e8f0eb;">
                    <p style="margin:0 0 5px;font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;color:#718278;text-transform:uppercase;">Correo</p>
                    <p style="margin:0;font-size:15px;line-height:22px;color:#172033;">${email}</p>
                  </td></tr>
                  <tr><td style="padding:15px 17px;border-bottom:1px solid #e8f0eb;">
                    <p style="margin:0 0 5px;font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;color:#718278;text-transform:uppercase;">Industria</p>
                    <p style="margin:0;font-size:15px;line-height:22px;color:#172033;">${industry}</p>
                  </td></tr>
                  <tr><td style="padding:15px 17px;">
                    <p style="margin:0 0 5px;font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;color:#718278;text-transform:uppercase;">¿Qué le gustaría mejorar?</p>
                    <p style="margin:0;font-size:15px;line-height:23px;color:#172033;">${message}</p>
                  </td></tr>
                </table>
                <p style="margin:18px 0 0;font-size:12px;line-height:18px;color:#718278;">Puedes responder a este correo para contactar a ${name}.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 30px;background-color:#f7fbf8;border-top:1px solid #e8f0eb;border-radius:0 0 16px 16px;">
                <p style="margin:0;font-size:11px;line-height:17px;color:#718278;">YUPPI · Infraestructura comercial impulsada por IA · Construida en Bolivia</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    'Nueva solicitud · YUPPI',
    '',
    `Nombre: ${values.name}`,
    `Negocio: ${values.business}`,
    `Correo: ${values.email}`,
    `Industria: ${values.industry}`,
    '',
    '¿Qué le gustaría mejorar?',
    values.message,
  ].join('\n');

  return { html, text };
}
