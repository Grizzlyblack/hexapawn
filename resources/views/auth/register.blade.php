@extends('layouts.app')

@section('content')
    <div class="flex flex-col items-center">
        <div class="card">
            <div class="mb-5 text-3xl">{{ __('Register') }}</div>

            <div class="text-lg">
                <form method="POST" action="{{ route('register') }}">
                    @csrf

                    @if($errors->any())
                        <div class="mb-3">
                            <ul>
                                @foreach($errors->all() as $error)
                                    <li> {{$error}}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <div class="mb-4">
                        <label for="name">{{ __('Username') }}</label>

                        <div>
                            <input id="name" type="text" class="input text-md @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>
                        </div>
                    </div>

                    

                    <div class="mb-4">
                        <label for="password">{{ __('Password') }}</label>

                        <div>
                            <input id="password" type="password" class="input text-md @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="password-confirm">{{ __('Confirm Password') }}</label>

                        <div>
                            <input id="password-confirm" type="password" class="input text-md" name="password_confirmation" required autocomplete="new-password">
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="button bg-white">
                            {{ __('Register') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
