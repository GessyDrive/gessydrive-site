export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    // Honeypot anti-spam
    if (data.website) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Spam détecté"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const html = `
      <h2>Nouvelle demande de devis Gessy Drive</h2>

      <h3>Coordonnées</h3>

      <p><strong>Nom :</strong> ${data.nom}</p>
      <p><strong>Prénom :</strong> ${data.prenom}</p>
      <p><strong>Téléphone :</strong> ${data.telephone}</p>
      <p><strong>Email :</strong> ${data.email}</p>

      <hr>

      <h3>Demande</h3>

      <p><strong>Objet :</strong> ${data.objet}</p>

      <h3>Départ</h3>

      <p>${data.departAdresse}</p>
      <p>${data.departCP} ${data.departVille}</p>

      <h3>Arrivée</h3>

      <p>${data.arriveeAdresse}</p>
      <p>${data.arriveeCP} ${data.arriveeVille}</p>

      <hr>

      <p><strong>Date souhaitée :</strong> ${data.dateSouhaitee}</p>
      <p><strong>Heure souhaitée :</strong> ${data.heureSouhaitee || "Non précisée"}</p>

      <p><strong>Type de véhicule :</strong> ${data.vehicule}</p>

      <hr>

      <h3>Informations complémentaires</h3>

      <p>${data.message}</p>
    `;

    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "gessydrive.gd@gmail.com",
        reply_to: data.email,
        subject: `Nouvelle demande de devis - ${data.nom} ${data.prenom}`,
        html
      })
    });

    const result = await resend.json();

    if (!resend.ok) {
      console.error(result);

      return new Response(
        JSON.stringify({
          success: false,
          error: result
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}