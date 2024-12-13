"use client";
import React, { useState, useEffect } from "react";
import { Card, Grid, Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // For dateClick functionality
import dayjs from "dayjs"; // For handling dates
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase"; // Firebase configuration
import { EventData, PromoData } from "@/utils/Types"; // Import EventData and PromoData types
import { eventsReference, promosReference } from "@/utils/References"; // Firebase reference for events and promos

const CalendarComponent = () => {
  const [eventsAndPromos, setEventsAndPromos] = useState<
    (EventData | PromoData)[]
  >([]); // Combined data for events and promos
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Track selected date
  const [calendarHeight, setCalendarHeight] = useState<string | number>("auto");

  // Fetch events and promos from Firebase
  useEffect(() => {
    const fetchData = () => {
      const eventRef = dbRef(db, eventsReference);
      const promoRef = dbRef(db, promosReference);

      const fetchedEvents: EventData[] = [];
      const fetchedPromos: PromoData[] = [];

      // Fetch events
      onValue(eventRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val() as EventData;
          fetchedEvents.push(event);
        });

        // Fetch promos
        onValue(promoRef, (promoSnapshot) => {
          promoSnapshot.forEach((promoChildSnapshot) => {
            const promo = promoChildSnapshot.val() as PromoData;
            fetchedPromos.push(promo);
          });

          // Combine events and promos
          setEventsAndPromos([...fetchedEvents, ...fetchedPromos]);
        });
      });
    };

    fetchData();
  }, []);

  // Handle day click to filter events/promos for the clicked day
  const handleDayClick = (selectedInfo: any) => {
    setSelectedDate(new Date(selectedInfo.dateStr)); // Update selected date
  };

  // Adjust calendar height based on window size
  useEffect(() => {
    const updateCalendarHeight = () => {
      if (window.innerWidth < 768) {
        setCalendarHeight(400); // Adjust height for smaller screens
      } else {
        setCalendarHeight("auto"); // Default height for larger screens
      }
    };

    updateCalendarHeight(); // Call on initial render
    window.addEventListener("resize", updateCalendarHeight); // Add resize event listener

    return () => {
      window.removeEventListener("resize", updateCalendarHeight); // Clean up listener
    };
  }, []);

  // Filter events and promos for the selected day
  const filteredEventsAndPromos = selectedDate
    ? eventsAndPromos.filter((item) =>
        dayjs(item.startDate).isSame(selectedDate, "day")
      )
    : [];

  // Event content customization to highlight event/promo days with a red circle
  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="event-dot">
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <Box p={4}>
      {/* Calendar Header with Year Navigation */}
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ p: 4 }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]} // Add interactionPlugin here
              initialView="dayGridMonth" // Fixed month view
              events={eventsAndPromos.map((item) => ({
                id: item.id.toString(),
                title: item.title,
                start: dayjs(item.startDate).format("YYYY-MM-DD"), // Use startDate from Firebase
              }))}
              eventContent={renderEventContent} // Add custom event rendering
              height={calendarHeight} // Dynamically adjust height
              headerToolbar={{
                left: "prev,next today", // Navigation buttons (prev, next)
                center: "title", // Calendar title in the center
                right: "", // Removed additional views (week, day)
              }}
              dayMaxEventRows={3} // Limit event rows per day for a clean look
              eventBackgroundColor="#b71c1c"
              eventTextColor="white"
              eventBorderColor="transparent"
              dateClick={handleDayClick} // Handle day click
            />
          </Card>
        </Grid>

        {/* Events List Section */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Events and Promos List for{" "}
              {selectedDate
                ? dayjs(selectedDate).format("MMMM D, YYYY")
                : "Selected Date"}
            </Typography>
            <Box mt={3}>
              {filteredEventsAndPromos.length > 0 ? (
                filteredEventsAndPromos.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      backgroundColor: "#b71c1c",
                      color: "white",
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                    }}
                    elevation={1}
                  >
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography>
                      {dayjs(item.startDate).format("MMMM D, YYYY")}
                    </Typography>
                    <Typography>{item.description}</Typography>
                  </Card>
                ))
              ) : (
                <Typography>No events or promos for this date</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Modernized Dark Red Theme */}
      <style jsx global>{`
        .fc .fc-toolbar {
          background-color: #b71c1c;
          color: white;
          border-radius: 8px;
          padding: 10px;
        }
        .fc .fc-button {
          background-color: #b71c1c;
          color: white;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: bold;
        }
        .fc .fc-button:hover {
          background-color: #d32f2f;
        }
        .fc .fc-daygrid-day {
          background-color: #f9f9f9;
          border-radius: 6px;
        }
        .fc .fc-day-today {
          background-color: #ffebee;
          border-radius: 6px;
        }
        .fc .fc-daygrid-event {
          background-color: #b71c1c;
          color: white;
          border-radius: 6px;
          padding: 2px 8px;
        }
        .fc .fc-daygrid-event:hover {
          background-color: #d32f2f;
        }
        .MuiIconButton-root {
          margin: 0 5px;
          padding: 8px;
        }

        /* Custom style for event circle */
        .fc-daygrid-day.fc-daygrid-event .event-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .event-dot::before {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 50%;
          top: 0;
          right: 0;
        }

        /* Add hover effect on all days */
        .fc-daygrid-day:hover {
          background-color: #ffebee;
          cursor: pointer;
        }
      `}</style>
    </Box>
  );
};

export default CalendarComponent;
