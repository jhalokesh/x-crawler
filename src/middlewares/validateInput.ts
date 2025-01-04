import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { IRequestWithDomain } from '../types';
import { Config } from '../config';

export const validateInputDomains = (
    req: IRequestWithDomain,
    res: Response,
    next: NextFunction
) => {
    const { domains } = req.body;

    // validate input
    if (!domains || !Array.isArray(domains)) {
        const err = createHttpError(
            400,
            'Invalid input. Domains must be an array of strings.'
        );
        next(err);
        return;
    }

    // Limit number of input domains as per the requirements
    const maxInputDomainLenAllowed = Number(Config.REQUEST_DOMAIN_COUNT);
    if (domains.length > maxInputDomainLenAllowed) {
        const err = createHttpError(
            400,
            `Max ${maxInputDomainLenAllowed} domains are allowed as input`
        );
        next(err);
        return;
    }

    // checking valid domains
    const validDomainRegex =
        /^(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,6}$/;

    let validDomains: string[] = [];
    let invalidDomains: string[] = [];

    domains.forEach((domain: string) => {
        const isValidDomain = validDomainRegex.test(domain);
        if (isValidDomain) {
            validDomains.push(domain);
        } else {
            invalidDomains.push(domain);
        }
    });

    if (validDomains.length <= 0) {
        const err = createHttpError(400, 'Please input valid domains');
        next(err);
        return;
    }

    // Attach valid domains & invalid domains list to the request object for use in controller
    req.validDomains = validDomains;
    req.invalidDomains = invalidDomains;

    next();
};
