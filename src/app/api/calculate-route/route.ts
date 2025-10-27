import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { pickup, dropoff, stops } = await request.json();
    
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here') {
      throw new Error('Google Maps API key not configured');
    }

    // Create waypoints string for multiple stops
    let waypoints = '';
    if (stops && stops.length > 0) {
      const validStops = stops.filter((stop: string) => stop.trim() !== '');
      if (validStops.length > 0) {
        waypoints = validStops.map((stop: string) => encodeURIComponent(stop)).join('|');
      }
    }

    // Build the Directions API URL
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${encodeURIComponent(pickup)}&` +
      `destination=${encodeURIComponent(dropoff)}` +
      (waypoints ? `&waypoints=${waypoints}` : '') +
      `&mode=driving&` +
      `traffic_model=best_guess&` +
      `departure_time=now&` +
      `key=${GOOGLE_MAPS_API_KEY}`;

    console.log('Calling Google Maps API:', directionsUrl.replace(GOOGLE_MAPS_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(directionsUrl);
    const data = await response.json();

    console.log('Google Maps API Response:', data.status, data.error_message || 'Success');

    if (data.status === 'OK' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      // Calculate total distance and duration from all legs
      const totals = route.legs.reduce((acc: any, leg: any) => ({
        distance: acc.distance + leg.distance.value,
        duration: acc.duration + leg.duration.value
      }), { distance: 0, duration: 0 });

      const result = {
        distance: Math.round((totals.distance / 1609.34) * 10) / 10, // Convert meters to miles
        duration: Math.round(totals.duration / 60), // Convert seconds to minutes
        summary: route.summary || 'Route calculated',
        polyline: route.overview_polyline?.points || '',
        waypoints: [pickup, ...stops.filter((s: string) => s.trim() !== ''), dropoff],
        status: 'success'
      };

      console.log('Route calculated:', result);
      return NextResponse.json(result);
    } else {
      console.error('Google Maps API Error:', data.status, data.error_message);
      throw new Error(`Google Maps API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Route calculation error:', error);
    
    // Return enhanced fallback calculation
    const stops = await request.json().then(data => data.stops || []);
    const fallbackDistance = 8 + stops.filter((s: string) => s.trim() !== '').length * 3;
    const fallbackDuration = Math.round(fallbackDistance * 2.8);
    
    return NextResponse.json({
      distance: fallbackDistance,
      duration: fallbackDuration,
      summary: "Estimated route (API unavailable)",
      polyline: "",
      waypoints: [],
      status: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}