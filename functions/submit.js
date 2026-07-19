export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    const {
      nom,
      prenom,
      email,
      telephone,
      depart,
      arrivee,
      date,
      heure,
      passagers,
      message
    } = data;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "gessydrive.gd@gmail.com",
        subject: `Nouvelle demande de devis - ${nom} ${prenom}`,
        html: `
          <h2>Nouvelle demande de devis</h2>

          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Prénom :</strong> ${prenom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${telephone}</p>

          <hr>

          <p><strong>Départ :</strong> ${depart}</p>
          <p><strong>Arrivée :</strong> ${arrivee}</p>
          <p><strong>Date :</strong> ${date}</p>
          <p><strong>Heure :</strong> ${heure}</p>
          <p><strong>Nombre de passagers :</strong> ${passagers}</p>

          <hr>

          <p><strong>Message :</strong></p>
          <p>${message || "Aucun message"}</p>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();

      return new Response(
        JSON.stringify({
          success: false,
          error
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