import { ZodError } from "zod";
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            //validate the request body, query, and params against the provided schema
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            //if it fails we catch the error and send a 400 response with the error message
            if (error instanceof ZodError) {
                res.status(400).json({
                    status: "fail",
                    errors: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return; //stop the execution of the function
            }
            next(error);
        }
    };
};
