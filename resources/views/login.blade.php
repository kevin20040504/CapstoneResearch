<!DOCTYPE html>
<html>
<head>
    <title>TMCC-SR Log-in</title>
    <link href="{{ asset('img/TMCC-logo.png') }}" rel="shortcut icon"/>
    <link href="{{ asset('css/main.css') }}" rel="stylesheet"  type="text/css">
</head>
<body>
    <img src="/img/TMCC-building-bg.jpg" alt="tmcc-login-bg" id="login-bg">

    <div id="login-container">
        <img src="/img/TMCC-logo.png" alt="login-tmcc-logo" id="login-TMCC-logo">
        <h2 id="school-title">TRECE MARTIRES CITY COLLEGE</h2>
        <h1 id="site-title">STUDENT RECORDS</h1>
        <div id="login-form">
            <form action="/login" method="POST">
                @csrf
                <label class="login-form-title">Username:</label>
                <input type="text" name="username" required><br>

                <label class="login-form-title">Password:</label>
                <input type="password" name="password" required><br>

                <button type="submit" id="login-button">
                    <img src="{{ asset('img/enter-icon.png') }}" alt="login-button" id="login-button-logo">
                    <label id="login-button-title">Login</label>
                </button>
            </form>
        </div>
    </div> 
</body>
</html>