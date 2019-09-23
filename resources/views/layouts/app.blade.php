<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="flex justify-center text-center md:text-left">
    <div id="app" class="md:mx-10 w-full" style="max-width: 1024px">
        <nav class="border-b border-black pt-5 pb-8">
            <div class="flex justify-between items-baseline">
                <p class="text-lg font-medium ml-10">
                    {{ config('app.name', 'Laravel') }}
                </p>

                <!-- Authentication Links -->
                <div>
                    @guest
                        <a href="{{ route('login') }}">{{ __('Login') }}</a>
                        @if (Route::has('register'))
                            <a class="ml-3" href="{{ route('register') }}">{{ __('Register') }}</a>
                        @endif
                    @else
                        <dropdown align="right">
                            <template v-slot:trigger>
                                <button class="flex text-sm focus:outline-none">

                                    {{auth()->user()->name}}
                                </button>
                            </template>

                            <form id="logout-form" method="POST" action="/logout">
                                @csrf

                                <button type="submit" class="dropdown-link w-full">Logout</button>
                            </form>
                        </dropdown>
                    @endguest
                </div>
            </div>
        </nav>

        <main class="pt-8">
            @yield('content')
        </main>
    </div>
</body>
</html>
