import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useState } from 'react'

import CoursesController from '#controllers/courses_controller'

import { Icons } from '~/lib/components/icons'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import TypewriterInput from '~/lib/components/typewriterInput'
import { Button } from '~/lib/components/ui/button'

const placeholders = [
  'What do you want to learn today?',
  'I want to learn how to code...',
  'I want to cook lasagna...',
  'I want to learn to play the piano...',
  'I want to to crack the Amazon SDE 1 interview...',
  'I want to learn to spanish...',
  'I want to get 2400/2400 in my SAT...',
  'I want to get into IIT...',
  'I want to learn training a dog...',
]

export default function CoursesCreatePage(props: InferPageProps<CoursesController, 'create'>) {
  const { user } = props as any
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (query.length < 10) {
        alert('Please enter a valid query')
        return
      }
      setIsLoading(true)
      const { data } = await axios.post('/courses', {
        query,
      })
      router.visit(`/courses/${data.course.id}/onboarding`)
    } catch (error: any) {
      alert('Error in creating course :' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <Layout.Header></Layout.Header>
      <Layout.Body>
        <div className="flex items-center justify-center bg-background">
          <div className="w-full max-w-md px-4 py-8 mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2 break-words sm:text-5xl lg:text-6xl">
              Hi{' '}
              <span className={`${user.fullName.length > 10 ? 'block mt-2' : 'inline'}`}>
                {user.fullName}!
              </span>
            </h1>
            <p className="text-xl mb-6 font-semibold">What would you like to learn today?</p>

            <form onSubmit={handleSubmit} className="relative w-full mb-8">
              <TypewriterInput
                placeholders={placeholders}
                typingSpeed={100}
                delay={2000}
                query={query}
                setQuery={setQuery}
              />

              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                variant="ghost"
              >
                {isLoading ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.search className="h-4 w-4" />
                )}
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <p className="text-center font-semibold">
              Our AI will generate a personalized course for you. Learn anything in any language at
              your own pace!
            </p>

            {/* Loading Spinner Section */}
            {isLoading && (
              <div className="flex flex-col bg-background">
                <div className="text-center">
                  <Icons.spinner className="w-16 h-16 mb-4 text-primary animate-spin mx-auto" />
                  <h2 className="text-2xl font-bold mb-2">Creating Your Course</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Please wait while our AI generates a personalized learning experience just for
                    you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}
