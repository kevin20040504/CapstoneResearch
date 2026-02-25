<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// PageController extends the base Controller class
// gives access to Laravel controller features
class PageController extends Controller
{
    public function search()
    {
        return view('search');
    }

    public function profile()
    {
        return view('profile');
    }

    public function add()
    {
        return view('add');
    }

    public function allFiles()
    {
        return view('allfiles');
    }
}