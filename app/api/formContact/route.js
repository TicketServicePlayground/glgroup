import {NextRequest, NextResponse} from "next/server";

async function verifyTurnstile(token, ip) {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const res = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: ip,
        }),
    });

    return await res.json();
}

export async function POST(request) {
    try {
        const {
            name,
            phone,
            email,
            id,
            message,
            token,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content
        } = await request.json();
        // return NextResponse.json({name, phone, email});

        if(!token){
            return NextResponse.json({success: false, error: "Captcha token missing"}, {status: 400});
        }

        const ip = request.headers.get("x-forwarded-for");
        const captcha = await verifyTurnstile(token, ip);

        if (!captcha.success) {
            return NextResponse.json({ success: false, error: "Captcha validation failed" }, { status: 400 });
        }

        const body = {
            fields: {
                "NAME": name,
                "PHONE": [{
                    "VALUE": phone,
                    "TYPE_ID": "PHONE"
                }],
                "EMAIL": [{
                    "VALUE": email,
                    "TYPE_ID": "EMAIL"
                }],
                "SOURCE_ID": "WEB",
                "UF_CRM_1723206843835": id,
                "UF_CRM_1723206895928": message,
                "UTM_SOURCE": utm_source,
                "UTM_MEDIUM": utm_medium,
                "UTM_CAMPAIGN": utm_campaign,
                "UTM_CONTENT": utm_content,
                "UTM_TERM": utm_term
            },
            params: {"REGISTER_SONET_EVENT": "Y"}

        };

        const response = await fetch(process.env.BITRIX_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const responseData = await response.json();

        return NextResponse.json({success: true, data: JSON.stringify(responseData)});
    } catch (e) {
        return NextResponse.json({success: false, error: e}, {status:500});
    }

}