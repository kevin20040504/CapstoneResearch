<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
    <link href="{{ asset('img/TMCC-logo.png') }}" rel="shortcut icon"/>
    <link href="{{ asset('css/main.css') }}" rel="stylesheet" type="text/css">
</head>
<body class="main-pages">

    {{-- Navbar --}}
    <div id="navbar-container">
        <div id="navbar-logo-container">
            <img src="/img/TMCC-logo.png" alt="navbar-tmcc-logo" id="navbar-TMCC-logo">
        </div>
        <div id="navbar-school-name-container">
            <h2 id="navbar-school-name">TRECE MARTIRES CITY COLLEGE</h2>
        </div>

        {{-- route('name') connects to named routes in web.php --}}
        <div>
            <a href="{{ route('profile') }}" class="nav-button">
                <img src="{{ asset('img/profile-page-icon.png') }}" alt="profile-page-icon" id="profile-page-icon">
                <span class="nav-button-title">PROFILE</span>
            </a>
        </div>
        <div>
            <a href="{{ route('search') }}" class="nav-button">
                <img src="{{ asset('img/search-doc-icon.png') }}" alt="search-doc-icon" id="search-doc-icon">
                <span class="nav-button-title">SEARCH</span>
            </a>
        </div>
        <div>
            <a href="{{ route('add') }}" class="nav-button">
                <img src="{{ asset('img/add-doc-icon.png') }}" alt="add-doc-icon" id="add-doc-icon">
                <span class="nav-button-title">ADD</span>
            </a>
        </div>
        <div>
            <a href="{{ route('allfiles') }}" class="nav-button">
                <img src="{{ asset('img/all-files-icon.png') }}" alt="all-files-icon" id="all-files-icon">
                <span class="nav-button-title">ALL FILES</span>
            </a>
        </div>
    </div>

    {{-- Page Content --}}
    {{-- where each page inserts its own content --}}
    <div id="main-page-content">
        @yield('content')
    </div>
</body>
</html>