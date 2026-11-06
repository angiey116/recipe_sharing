const request = require('supertest');
const app = require('../server');

describe('Recipe API Tests', () => {

    describe('GET /api/recipes', () => {
        test('should return all recipes', async () => {
    const response = await request(app)
        .get('/api/recipes')
        .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
});

        test('should return recipes with correct structure', async () => {
    const newRecipe = {
        name: 'Structure Test Recipe',
        ingredients: 'Flour',
        instructions: 'Mix ingredients',
        cookTime: '10 minutes'
    };

    const created = await request(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);

    const response = await request(app)
        .get(`/api/recipes/${created.body.id}`)
        .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('ingredients');
    expect(response.body).toHaveProperty('instructions');
    expect(response.body).toHaveProperty('cookTime');
});
    });

    describe('POST /api/recipes', () => {
        test('should create a new recipe', async () => {
            const newRecipe = {
                name: 'Test Recipe',
                ingredients: 'Test ingredient 1\nTest ingredient 2',
                instructions: 'Test instructions',
                cookTime: '30 minutes'
            };

            const response = await request(app)
                .post('/api/recipes')
                .send(newRecipe)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newRecipe.name);
            expect(response.body.ingredients).toBe(newRecipe.ingredients);
            expect(response.body.instructions).toBe(newRecipe.instructions);
            expect(response.body.cookTime).toBe(newRecipe.cookTime);
        });

        test('should return 400 for invalid recipe data', async () => {
            const invalidRecipe = {
                name: '', // Empty name should fail
                ingredients: '',
                instructions: '',
                cookTime: '' 
            };

            await request(app)
            .post('/api/recipes')
            .send(invalidRecipe)
            .expect(400);
        });
    });

    describe('GET /api/recipes/:id', () => {
        test('should return a specific recipe', async () => {
    const newRecipe = {
        name: 'Specific Test Recipe',
        ingredients: 'Flour',
        instructions: 'Mix ingredients',
        cookTime: '15 minutes'
    };

    const created = await request(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);

    const response = await request(app)
        .get(`/api/recipes/${created.body.id}`)
        .expect(200);

    expect(response.body).toHaveProperty('id', created.body.id);
    expect(response.body).toHaveProperty('name', newRecipe.name);
});

        test('should return 404 for non-existent recipe', async () => {
            await request(app)
                .get('/api/recipes/999')
                .expect(404);
        });
    });

    describe('DELETE /api/recipes/:id', () => {
        test('should delete an existing recipe', async () => {
            // First create a recipe to delete
            const newRecipe = {
                name: 'Recipe to Delete',
                ingredients: 'Ingredient 1',
                instructions: 'Instructions',
                cookTime: '20 minutes'
            };

            const createResponse = await request(app)
                .post('/api/recipes')
                .send(newRecipe)
                .expect(201);

            const recipeId = createResponse.body.id;

            // Then delete it
            await request(app)
                .delete(`/api/recipes/${recipeId}`)
                .expect(204);

            // Verify it's deleted
            await request(app)
                .get(`/api/recipes/${recipeId}`)
                .expect(404);
        });

        test('should return 404 for deleting non-existent recipe', async () => {
            await request(app)
                .delete('/api/recipes/999')
                .expect(404);
        });
    });

    describe('GET /api/health', () => {
        test('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('timestamp');
        });
    });
});
