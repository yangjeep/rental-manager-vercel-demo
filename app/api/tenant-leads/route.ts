import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyRecordId, name, email, phone, message, moveInDate, numberOfOccupants, employmentStatus } = body;

    // Validate required fields
    if (!propertyRecordId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Property, name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Validate email format
    // Using a simpler regex to avoid ReDoS vulnerabilities
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 320) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const table = "tenant-leads";

    if (!token || !baseId) {
      console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Prepare Airtable record
    const fields: Record<string, any> = {
      "Title (from Property)": [propertyRecordId],
      "Name": name,
      "Email": email,
      "Phone Number": phone,
    };

    if (moveInDate) {
      fields["Ideal Move-in Date"] = moveInDate;
    }

    if (numberOfOccupants) {
      const numOccupants = Number(numberOfOccupants);
      if (!isNaN(numOccupants) && numOccupants > 0) {
        fields["Number of Occupants"] = numOccupants;
      }
    }

    if (employmentStatus) {
      fields["Employment Status"] = employmentStatus;
    }

    if (message) {
      fields["Message"] = message;
    }

    // Submit to Airtable
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Airtable API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to submit form. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

