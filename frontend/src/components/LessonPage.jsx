import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/lessons/${id}`)
      .then(res => res.json())
      .then(data => setLesson(data));
  }, [id]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.content_html }} className="mb-4" />
      <Link to={`/game/${lesson.id}`} className="bg-blue-500 text-white px-4 py-2 rounded">
        Play Game
      </Link>
    </div>
  );
}

export default LessonPage;
