import { auth } from "express-oauth2-jwt-bearer";

export const checkOutAuth0JWT=auth({
    audience:`${process.env.OAUTH_AUDIENDE}`,
    issuerBaseURL:`${process.env.OAUTH_DOMAIN}`,
});