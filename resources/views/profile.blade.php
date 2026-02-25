<!DOCTYPE html>
<html>
<head>
    <title>TMCC-SR PROFILE</title>
    <link href="{{ asset('img/TMCC-logo.png') }}" rel="shortcut icon"/>
    <link href="{{ asset('css/main.css') }}" rel="stylesheet"  type="text/css">
</head>
<body>
    {{-- tells Laravel to use layouts/pages.blade.php --}}
    @extends('layouts.pages')

    @section('title', 'Profile')

    {{-- content replaces @yield('content') in layout --}}
    @section('content')
        PROFILE
        <img src="/img/TMCC-logo.png" alt="login-tmcc-logo" id="login-TMCC-logo">
    @endsection
</body>
</html>