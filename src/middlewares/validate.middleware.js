import { formatZodError } from "../utils/validateGraphql.js";

const validateTarget = (schema, target) => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Validation failed",
                errors: result.error.flatten().fieldErrors,
                details: formatZodError(result.error)
            });
        }

        if (target === "query") {
            req.validatedQuery = result.data;
        } else if (target === "params") {
            req.validatedParams = result.data;
        } else {
            req[target] = result.data;
        }

        next();
    };
};

export const validate = (schema) => validateTarget(schema, "body");

export const validateQuery = (schema) => validateTarget(schema, "query");

export const validateParams = (schema) => validateTarget(schema, "params");
