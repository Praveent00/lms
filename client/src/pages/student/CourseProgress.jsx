import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useGetCourseProgressQuery, useMarkCourseAsCompletedMutation, useMarkCourseAsInCompletedMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  useGetCourseProgressQuery(courseId);
  const [UpdateLectureProgress] = useUpdateLectureProgressMutation();
  const [CompleteCourse, { data: markCompletedData, isSuccess: completedSuccess }] = useMarkCourseAsCompletedMutation();
  const [IncompleteCourse, { data: markInCompletedData, isSuccess: incompletedSuccess }] = useMarkCourseAsInCompletedMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompletedData.message)
    }
    if (incompletedSuccess) {
      refetch();
      toast.success(markInCompletedData.message)
    }
  }, [completedSuccess, incompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading course progress.</p>;
  console.log(data);
  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  }
  const handleLectureProgress = async (lectureId) => {
    await UpdateLectureProgress({ courseId, lectureId });
    refetch();
  }

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  }

  const handleCompleteCourse = async () => {
    await CompleteCourse(courseId);
  }
  const handleIncompleteCourse = async () => {
    await IncompleteCourse(courseId);
  }

  return (
    <div className='p-4 mx-auto mt-20 max-w-7xl'>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold' >{courseTitle}</h1>
        <Button onClick={completed ? handleIncompleteCourse : handleCompleteCourse}
          variant={completed ? 'outline' : 'default'}>
          {completed ? (
            <div className='flex items-center '>
              <CheckCircle className='w-4 h-4 mr-2' />
             Complete
            </div>
          ) : (
            <div className='flex items-center '>
              <CheckCircle2 className='w-4 h-4 mr-2' />
              Mark as InComplete
            </div>
          )}
        </Button>
      </div>
      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='flex-1 p-4 rounded-lg shadow-lg md:w-1/5 h-fit'>
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className='w-full h-auto rounded-lg shadow-md'
              onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
            />
          </div>
          <div className='mt-2'>
            <h3 className='text-lg font-medium'>{
              `Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === currentLecture?._id) + 1 || courseDetails.lectures.findIndex(lecture => lecture._id || initialLecture?._id) + 1}: ${currentLecture?.lectureTitle || initialLecture?.lectureTitle}`
            }</h3>
          </div>
        </div>
        <div className='flex flex-col w-full pt-4 border-t border-gray-200 md:w-2/5 md:border-t-0 md:border-l md:pl-4 md:pt-0'>
          <h2 className='mb-4 text-xl font-semibold'>Course Letcure</h2>
          <div className='flex-1 overflow-y-auto'>
            {
              courseDetails?.lectures.map((lecture) =>
                <Card key={lecture._id} className={`mb-3 transition transform hover:cursor-pointer ${lecture._id === currentLecture?._id ? 'bg-gray-100' : ''}`}
                  onClick={() => handleSelectLecture(lecture)}>
                  <CardContent className='flex items-center justify-between p-4'>
                    <div className='flex items-center'>
                      {
                        isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='mr-2 text-green-500' />) : (<CirclePlay size={24} className='mr-2 text-gray-500' />)
                      }
                      <div>
                        <CardTitle className="text-lg font-medium">{lecture.lectureTitle}</CardTitle>
                      </div>
                    </div>
                    {
                      isLectureCompleted(lecture._id) ? (
                        <Badge variant={'outline'} className='text-green-600 bg-green-200'> Completed</Badge>
                      ) : (
                        <Badge variant={'outline'} className='text-gray-600 bg-gray-200'> Not Completed</Badge>
                      )
                    }
                  </CardContent>
                </Card>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress
