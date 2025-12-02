import { GoogleAuth } from 'google-auth-library'

import { createErrorLogger } from './error-handler'

export type EmailPayload = {
	receiver: string[]
	subject: string
	body: string
}

export async function sendEmail(emailPayload: EmailPayload, recipientType: string) {
	const emailApiUrl = process.env.EMAIL_API_URL as string

	try {
		const auth = new GoogleAuth()
		const client = await auth.getIdTokenClient(emailApiUrl)

		await client.request({
			url: emailApiUrl,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: emailPayload,
			timeout: 10000,
		})
	} catch (error) {
		createErrorLogger(`Error sending email to ${recipientType}`, {
			receiver: emailPayload.receiver,
		})(error)
	}
}