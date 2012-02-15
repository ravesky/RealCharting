// ---------------------------------------------------------------------------
// jWebSocket - Chart Stream
// Copyright (c) 2010 Alexander Schulze, Innotrade GmbH
// ---------------------------------------------------------------------------
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as published by the
// Free Software Foundation; either version 3 of the License, or (at your
// option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
// more details.
// You should have received a copy of the GNU Lesser General Public License along
// with this program; if not, see <http://www.gnu.org/licenses/lgpl.html>.
// ---------------------------------------------------------------------------
package org.jwebsocket.plugins.streaming;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.Date;

import org.apache.log4j.Logger;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;
import org.jwebsocket.token.TokenFactory;

/**
 * implements the ChartStream. It implements an internal thread 
 * which broadcasts custom database query of the server to
 * count the status of record type once per second.
 * @author Angel Martin
 */
public class ChartStream extends TokenStream {

   private static Logger log = Logging.getLogger(ChartStream.class);
   private Boolean mIsRunning = false;
   private TimerProcess mTimeProcess = null;
   private Thread mTimeThread = null;
   private Connection mConnection = null;

   /**
    * @param aStreamID
    * @param aServer
    */
   public ChartStream(String aStreamID, TokenServer aServer) {
      super(aStreamID, aServer);
      startStream(-1);
   }

   /**
    *
    */
   @Override
   public void startStream(long aTimeout) {
      super.startStream(aTimeout);

      if (log.isDebugEnabled()) {
         log.debug("Starting Chart stream...");
      }
      
      try {
          Class.forName("com.timesten.jdbc.TimesTenDriver");
          mConnection = DriverManager.getConnection(
               "jdbc:timesten:direct:DSN=DS_ttIUM;UID=ium;PWD=01ium00");
          /*
          Class.forName("com.mysql.jdbc.Driver");
          mConnection = DriverManager.getConnection(
                  "jdbc:mysql://localhost/jWebSocket", "root", "");
          */
          
         if (log.isDebugEnabled()) {
               log.debug("Connection with Timesten database established...");
           }
      } catch (SQLException lEx) {
         lEx.printStackTrace();
      } catch (ClassNotFoundException lEx) {
         lEx.printStackTrace();
      }
      
      mTimeProcess = new TimerProcess();
      mTimeThread = new Thread(mTimeProcess);
      mTimeThread.start();
   }

   /**
    *
    */
   @Override
   public void stopStream(long aTimeout) {
      if (log.isDebugEnabled()) {
         log.debug("Stopping Chart stream...");
      }
      long lStarted = new Date().getTime();
      mIsRunning = false;
      try {
         mTimeThread.join(aTimeout);
      } catch (Exception lEx) {
         log.error(lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
      }
      if (log.isDebugEnabled()) {
         long lDuration = new Date().getTime() - lStarted;
         if (mTimeThread.isAlive()) {
            log.warn("Chart stream did not stopped after " + lDuration + "ms.");
         } else {
            log.debug("Chart stream stopped after " + lDuration + "ms.");
         }
      }

      try {
         if (mConnection != null && !mConnection.isClosed()) {
             if (log.isDebugEnabled()) {
                 log.debug("Closing connection...");
             }
             mConnection.close();
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
      
      super.stopStream(aTimeout);
   }

   private class TimerProcess implements Runnable {

      @Override
      public void run() {
         if (log.isDebugEnabled()) {
            log.debug("Running chart stream...");
         }
         mIsRunning = true;
         while (mIsRunning) {
            try {
               Thread.sleep(1000);

               Token lToken = TokenFactory.createToken("event");
               lToken.setString("name", "stream");
               lToken.setString("msg", new Date().toString());
               lToken.setString("streamID", getStreamID());
               
               try {
                  PreparedStatement pSelect = 
                        mConnection.prepareStatement(
                        "SELECT PLAYER_STATUSSTRING AS STATUS, " +
                        "COUNT(PLAYER_STATUSSTRING) AS COUNT, " +
                        "SYSDATE AS CURRENT_DATE " +
                        "FROM SESSIONS " +
                        "GROUP BY PLAYER_STATUSSTRING");
                  
                  /*
                  PreparedStatement pSelect = 
                        mConnection.prepareStatement(
                              "SELECT STATUS, " +       // "status"
                              "COUNT(STATUS), " +       // "count"
                              "NOW() " +                // "date"
                              "FROM SESSIONS " +
                              "GROUP BY STATUS");
                  */
                  
                  ResultSet pResult = pSelect.executeQuery();
                  
                  while (pResult.next()) {
                     lToken.setInteger(pResult.getString(1), pResult.getInt(2));
                  }
                  
                  log.debug("Chart Streamer Token '" + lToken + "'...");
                          
               } catch (SQLException lEx) {
                       lEx.printStackTrace();
               }
               
               put(lToken);
               
            } catch (InterruptedException lEx) {
               log.error("(run) " + lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
            }
         }
         if (log.isDebugEnabled()) {
            log.debug("Chart stream stopped.");
         }
      }
   }
}
