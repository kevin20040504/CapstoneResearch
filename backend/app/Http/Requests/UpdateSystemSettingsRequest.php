<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'institution_name' => ['nullable', 'string', 'max:255'],
            'institution_short_name' => ['nullable', 'string', 'max:100'],
            'institution_address' => ['nullable', 'string', 'max:500'],
            'academic_year' => ['nullable', 'string', 'max:20'],
            'semester' => ['nullable', 'string', 'max:50'],
            'record_types' => ['nullable', 'array'],
            'record_types.*' => ['string', 'max:50'],
            'email_notifications_enabled' => ['nullable', 'boolean'],
        ];
    }
}
