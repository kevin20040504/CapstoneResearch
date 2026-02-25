<!DOCTYPE html>
<html>
<head>
    <title>TMCC-SR Add Student</title>
    <link href="{{ asset('img/TMCC-logo.png') }}" rel="shortcut icon"/>
    <link href="{{ asset('css/main.css') }}" rel="stylesheet"  type="text/css">
</head>
<body>
    {{-- tells Laravel to use layouts/pages.blade.php --}}
    @extends('layouts.pages')

    @section('title', 'Add')

    {{-- content replaces @yield('content') in layout --}}
    @section('content')
        ADD
        <img src="/img/TMCC-logo.png" alt="login-tmcc-logo" id="login-TMCC-logo">
    @endsection
</body>
</html>