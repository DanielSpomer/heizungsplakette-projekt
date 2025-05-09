import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Attempting to fetch Heizungsplakette data...');
    const heizungsplaketten = await prisma.heizungsplakette.findMany({
        orderBy: {
            createdAt: 'desc', 
        }
    });
    console.log(`Successfully fetched ${heizungsplaketten.length} Heizungsplakette records.`);
    return NextResponse.json(heizungsplaketten);
  } catch (error) {
    console.error('Error fetching Heizungsplakette data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    
    // Ensure all required fields are present and of the correct type
    // Consider adding more robust validation here (e.g., using Zod)
    const sanitizedData = {
      status: "Ausstehend", // Default status
      paymentStatus: formData.paymentStatus !== undefined ? Boolean(formData.paymentStatus) : false, // Default paymentStatus
      datenschutzUndNutzungsbedingungen: Boolean(formData.datenschutzUndNutzungsbedingungen),
      einwilligungDatenverarbeitung: Boolean(formData.einwilligungDatenverarbeitung),
      aufforderungSofortigeTaetigkeit: Boolean(formData.aufforderungSofortigeTaetigkeit),
      email: String(formData.email),
      artDerImmobilie: String(formData.artDerImmobilie),
      artDerImmobilieSonstige: formData.artDerImmobilieSonstige ? String(formData.artDerImmobilieSonstige) : null,
      alterDerHeizung: String(formData.alterDerHeizung),
      heizungsart: String(formData.heizungsart),
      heizungsartSonstige: formData.heizungsartSonstige ? String(formData.heizungsartSonstige) : null,
      strasse: String(formData.strasse),
      hausnummer: String(formData.hausnummer),
      postleitzahl: String(formData.postleitzahl),
      ort: String(formData.ort),
      heizsystem: String(formData.heizsystem),
      heizsystemSonstige: formData.heizsystemSonstige ? String(formData.heizsystemSonstige) : null,
      heizungshersteller: String(formData.heizungshersteller),
      baujahr: Number(formData.baujahr),
      typenbezeichnung: String(formData.typenbezeichnung),
      typenbezeichnungUnbekannt: Boolean(formData.typenbezeichnungUnbekannt),
      heizungstechnik: String(formData.heizungstechnik),
      heizungstechnikSonstige: formData.heizungstechnikSonstige ? String(formData.heizungstechnikSonstige) : null,
      energietraeger: String(formData.energietraeger),
      energietraegerSonstige: formData.energietraegerSonstige ? String(formData.energietraegerSonstige) : null,
      energieausweis: String(formData.energieausweis),
      energielabel: String(formData.energielabel),
      energieausweisDate: formData.energieausweisDate ? String(formData.energieausweisDate) : null,
      vorname: String(formData.vorname),
      nachname: String(formData.nachname),
      personStrasse: String(formData.personStrasse),
      personHausnummer: String(formData.personHausnummer),
      personPostleitzahl: String(formData.personPostleitzahl),
      personOrt: String(formData.personOrt),
      istEigentuemer: String(formData.istEigentuemer),
      heizungsanlageFotos: Array.isArray(formData.heizungsanlageFotos) ? formData.heizungsanlageFotos : [],
      heizungsetiketteFotos: Array.isArray(formData.heizungsetiketteFotos) ? formData.heizungsetiketteFotos : [],
      heizungslabelFotos: Array.isArray(formData.heizungslabelFotos) ? formData.heizungslabelFotos : [],
      bedienungsanleitungFotos: Array.isArray(formData.bedienungsanleitungFotos) ? formData.bedienungsanleitungFotos : [],
      verzichtAufHeizungsanlageFotos: Boolean(formData.verzichtAufHeizungsanlageFotos),
      verzichtAufHeizungsetiketteFotos: Boolean(formData.verzichtAufHeizungsetiketteFotos),
      verzichtAufHeizungslabelFotos: Boolean(formData.verzichtAufHeizungslabelFotos),
      verzichtAufBedienungsanleitungFotos: Boolean(formData.verzichtAufBedienungsanleitungFotos),
      confirmAccuracy: Boolean(formData.confirmAccuracy),
      herkunft: String(formData.herkunft),
    };

    const savedData = await prisma.heizungsplakette.create({
      data: sanitizedData,
    });
    return NextResponse.json({ success: true, id: savedData.id });
  } catch (error) {
    console.error('Error saving Heizungsplakette data:', error);
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
  }
}