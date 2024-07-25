import { Resend } from "resend";
import nodemailer from "nodemailer";
import { InternalServerError } from "http-errors-enhanced";

type EmailProvider = "resend" | "nodemailer";

interface EmailOptions {
	from?: string;
	to: string[];
	subject: string;
	html: string;
	text: string;
}

export default class MailerProvider {
	private emailProvider: EmailProvider = "resend";
	private resend: Resend | null = null;
	private transporter: nodemailer.Transporter | null = null;

	constructor(emailProvider?: EmailProvider) {
		this.emailProvider =
			emailProvider || (process.env.MAIL_PROVIDER as EmailProvider);

		if (this.emailProvider === "resend") {
			this.resend = new Resend(process.env.RESEND_API_KEY);
		} else if (this.emailProvider === "nodemailer") {
			this.transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT),
				secure: Number(process.env.SMTP_PORT) === 465,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			});
		}
	}

	async sendEmail(options: EmailOptions) {
		if (this.emailProvider === "resend" && this.resend) {
      if(!process.env.RESEND_EMAIL) {
        throw new InternalServerError("RESEND_EMAIL is not defined");
      }

			const { data, error } = await this.resend.emails.send({
				from: process.env.RESEND_EMAIL,
				to: options.to,
				subject: options.subject,
				html: options.html,
				text: options.text,
			});

      if (error) {
        throw new InternalServerError(error);
      }

      return data;
		}

    if (this.emailProvider === "nodemailer" && this.transporter) {
      return await this.transporter.sendMail({
        from: options.from,
        to: options.to.join(", "),
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    }
	}
}
