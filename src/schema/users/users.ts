import { z } from "zod"; //Zod is a TypeScript-first schema declaration and validation library
import { buildJsonSchemas } from "fastify-zod"; // to modify the response user gets

const userCore = {
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
    name: z.string(),
}

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }),
});

const createUserResponseSchema = z.object({
    id: z.string(),
    ...userCore,
})

const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
    password: z.string(),
})

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

const updateUserSchema = z.object({
    email: z.string(),
    name: z.string(),

})

const updateUserResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),

})

const deleteUserSchema = z.object({
    id: z.string(),

})

//infer is a type not a fx hence use of <>
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<(typeof deleteUserSchema)>;


export const {schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
    updateUserSchema,
    updateUserResponseSchema,
    deleteUserSchema,
})