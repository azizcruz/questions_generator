<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SearchHistoryTest extends TestCase
{
    use RefreshDatabase;

    private $url = 'https://opentdb.com/api.php*';

    public function test_adding_new_search_history_with_valid_data(): void
    {
        $data = [
            'full_name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'num_questions' => 10,
            'difficulty' => 'medium',
            'type' => 'multiple',
        ];

        Http::fake([
            $this->url => Http::response(['results' => []], 200),
        ]);

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(200);

        $this->assertDatabaseHas('search_histories', [
            'full_name' => $data['full_name'],
            'email' => $data['email'],
        ]);
    }

    public function test_adding_new_search_history_with_invalid_data(): void
    {
        $data = [
            'full_name' => '', // Invalid: empty full name
            'email' => 'invalid-email', // Invalid: invalid email format
            'num_questions' => 10,
            'difficulty' => 'medium',
            'type' => 'multiple',
        ];

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(422); // Expecting validation error

        $response->assertJsonValidationErrors([
            'full_name', 'email'
        ]);
    }

    public function test_adding_new_search_history_with_invalid_num_questions_50_and_above(): void
    {
        $data = [
            'full_name' => 'test',
            'email' => 'test@test.com',
            'num_questions' => 50, // Invalid 
            'difficulty' => 'medium',
            'type' => 'multiple',
        ];

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(422); // Expecting validation error

        $response->assertJsonValidationErrors([
            'num_questions',
        ]);
    }

    public function test_adding_new_search_history_with_invalid_difficulty_choice(): void
    {
        $data = [
            'full_name' => 'test',
            'email' => 'test@test.com',
            'num_questions' => 10, 
            'difficulty' => 'not correct', // Invalid 
            'type' => 'multiple',
        ];

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(422); // Expecting validation error

        $response->assertJsonValidationErrors([
            'difficulty',
        ]);
    }

    public function test_adding_new_search_history_with_invalid_type_choice(): void
    {
        $data = [
            'full_name' => 'test',
            'email' => 'test@test.com',
            'num_questions' => 10, 
            'difficulty' => 'hard', 
            'type' => 'not correct', // Invalid 
        ];

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(422); // Expecting validation error

        $response->assertJsonValidationErrors([
            'type',
        ]);
    }

    public function test_it_respects_rate_limit(): void
    {
        $data = [
            'full_name' => 'test',
            'email' => 'test@test.com',
            'num_questions' => 10,
            'difficulty' => 'hard',
            'type' => 'multiple',
        ];

        for ($i = 0; $i < 10; $i++) {
            Http::fake([$this->url => Http::response(['results' => []], 200)]);
            $response = $this->post(route('api.search-history'), $data); //multiple allowed requests
            $response->assertStatus(200); // Assuming a successful response status code
        }

        $response = $this->post(route('api.search-history'), $data); // one extra limited request
        $response->assertStatus(429); // Expects a 429 Too Many Requests status code
    }

    // test after adding a search history the response should include an array in results key and this does not include any data that has a category of "Entertainment: Video Games", it should fake the http request
    public function test_search_history_response_does_not_include_video_games_category(): void
    {
        $data = [
            'full_name' => 'test',
            'email' => 'test@test.com',
            'num_questions' => 10,
            'difficulty' => 'hard',
            'type' => 'multiple',
        ];

        Http::fake([
            $this->url => Http::response([
                'results' => [
                    [
                        'category' => 'Entertainment: Video Games',
                        'question' => 'Joseph Atari had a criminal past doing what?',
                        'correct_answer' => 'Robbing Trains',
                        'incorrect_answers' => [
                            'Murder for Hire',
                            'Tax Evasion',
                            'Identity Fraud',
                        ],
                        'type' => 'multiple',
                        'difficulty' => 'medium',
                    ],
                    [
                        'category' => 'Science',
                        'question' => 'What is the capital of France?',
                        'correct_answer' => 'Paris',
                        'incorrect_answers' => [
                            'London',
                            'Berlin',
                            'Madrid',
                        ],
                        'type' => 'multiple',
                        'difficulty' => 'hard',
                    ],
                ],
                200
            ]),
        ]);

        $response = $this->post(route('api.search-history'), $data);

        $response->assertStatus(200); // Assuming a successful response status code

        $responseData = $response->json();

        // Assert that the response does not include the "Entertainment: Video Games" category
        $this->assertFalse(collect($responseData['results'])->contains('category', 'Entertainment: Video Games'));
    }

}
