import React, { useState } from 'react';
import axios from 'axios';

const App = () => {

  const [query, setQuery] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  const fetchRepositories = async (page = 1) => {
    if (!query) return;

    setLoading(true);
    setError('');
    try {
      const result = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=12&page=${page}`);

      if (page === 1) {
        setRepositories(result.data.items); 
      } else {
        setRepositories((prevRepos) => [...prevRepos, ...result.data.items]); 
      }
    } catch (error) {
      setError('Error fetching repositories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-10">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-800">GitHub Repository Explorer</h1>
      </header>

      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Search GitHub Repositories..."
          />
          <button
            onClick={fetchRepositories}
            className="ml-4 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {repositories.map((repo) => (
            <div key={repo.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className='flex gap-4 items-center'>
                <img src={repo.owner.avatar_url} alt={`${repo.owner.login}'s avatar`} className="w-12 h-12 rounded-full" />
                <h1 className="text-gray-600 text-xl font-semibold">
                  <a href={repo.owner.html_url}  target="_blank" className="hover:underline">{repo.owner.login}</a>
                </h1>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mt-2">
                <a href={repo.html_url} target="_blank"  className="hover:underline">{repo.name}</a>
              </h3>
              <p className="mt-2 text-gray-700 overflow-x-clip ">{repo.description || 'No description available'}</p>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Stars:</strong> {repo.stargazers_count}</p>
                <p><strong>Forks:</strong> {repo.forks_count}</p>
                <p><strong>Open Issues:</strong> {repo.open_issues_count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {repositories.length > 0 && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
              fetchRepositories(nextPage);
            }}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}

      <footer className="text-center mt-10">
        <p className="text-gray-600">© 2023 GitHub Repository Explorer</p>
      </footer>
    </div>
  );
};

export default App;