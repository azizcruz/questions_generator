<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchHistoryValidator;
use App\Models\SearchHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SearchHistoryController extends Controller
{
    public function index()
    {
        //
    }

    public function store(SearchHistoryValidator $request)
    {
        
        $data = $request->validated();

        $dificulty = $data['difficulty'];
        $type = $data['type'];
        $numberOfQuestions = $data['num_questions'];

        $searchHistory = new SearchHistory();
        $searchHistory->fill($data);

        $searchHistory->save();

        $url = "https://opentdb.com/api.php?amount=$numberOfQuestions&difficulty=$dificulty&type=$type";

        $questions = Http::get($url);

        // Filter out Entertainment: Video Games
        $filteredQuestions = array_filter($questions->json()['results'], function ($question) {
            return $question['category'] !== 'Entertainment: Video Games';
        });

        // Sort by category
        usort($filteredQuestions, function ($a, $b) {
            return strcmp($a['category'], $b['category']);
        });

        return response()->json([
            'success' => true,
            'results' => $filteredQuestions,
            'count' => count($filteredQuestions),
        ]);
    }
}
