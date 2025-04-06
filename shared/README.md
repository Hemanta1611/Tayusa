# Tayusa Shared Resources

This directory contains shared resources and utilities used by multiple components of the Tayusa platform.

## Structure

- **uploads/**: User-uploaded content (videos, images, etc.)
- **static/**: Static assets like icons, fonts, shared styles
- **utils/**: Common utility functions used by both frontend and backend
- **constants/**: Shared constants, error messages, and application-wide settings

## Purpose

The shared directory facilitates code reuse and consistency across the entire application. It helps maintain a single source of truth for assets and utilities that are used by multiple components of the Tayusa platform.

## Usage

Both the backend and frontend can import utilities from this directory. The uploads folder serves as a common storage location for user-generated content before it's processed and stored in the database or cloud storage.
