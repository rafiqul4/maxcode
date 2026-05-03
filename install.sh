#!/bin/bash

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Setup complete! To run:"
echo "  Frontend: cd frontend && npm run dev"
echo "  Backend:  cd backend && npm run dev"
