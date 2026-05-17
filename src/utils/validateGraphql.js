const formatFieldErrors = (fieldErrors) => {
    return Object.entries(fieldErrors)
        .flatMap(([field, messages]) =>
            messages.map(message => `${field}: ${message}`)
        );
};

export const formatZodError = (error) => {
    const {
        fieldErrors,
        formErrors
    } = error.flatten();

    return [
        ...formErrors,
        ...formatFieldErrors(fieldErrors)
    ].join("; ");
};

export const parseGraphQLInput = (schema, data) => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const message = formatZodError(result.error);

        throw new Error(
            message ? `Validation failed: ${message}` : "Validation failed"
        );
    }

    return result.data;
};
