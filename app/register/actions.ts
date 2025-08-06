'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { RegisterFormData } from '@/types/auth';
import db from '@/src/db';
import { UserTable } from '@/src/db/schema/user';

export async function signup(formData: RegisterFormData) {
  const { name, email, password } = formData;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  console.log('authData', authData);
  console.log('authError', authError);

  if (authError) {
    console.error('Auth Error:', authError.message);
    
    let errorCode = 500;
    let errorMessage = 'Failed to create account';

    if (authError.message.includes('User already registered')) {
      errorCode = 409;
      errorMessage = 'This email address is already registered';
    } else if (authError.message.includes('Invalid email')) {
      errorCode = 400;
      errorMessage = 'Invalid email address';
    } else if (authError.message.includes('Password')) {
      errorCode = 400;
      errorMessage = 'Invalid password';
    }

    console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  if (!authData.user) {
    const errorCode = 500;
    const errorMessage = 'Failed to create user';
    console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  // Check for duplicate user (when email confirmation is enabled)
  // Empty identities array indicates existing user (confirmed)
  if (authData.user.identities && authData.user.identities.length === 0) {
    const errorCode = 409;
    const errorMessage = 'This email address is already registered';
    console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);
    console.log('Existing user detected: identities array is empty');

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  // Insert user data into the database
  try {
    await db.insert(UserTable).values({
      id: authData.user.id,
      name: name || null,
      email,
    });
  } catch (dbError) {
    console.error('DB Error:', dbError);
    const errorCode = 500;
    const errorMessage = 'Failed to save user data';
    console.error(`Error Code: ${errorCode}, Message: ${errorMessage}`);

    // If database save fails, delete the auth user
    try {
      await supabase.auth.admin.deleteUser(authData.user.id);
    } catch (deleteError) {
      console.error('Failed to delete auth user:', deleteError);
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  // Redirect to email check page
  return redirect('/auth/check-email');
}