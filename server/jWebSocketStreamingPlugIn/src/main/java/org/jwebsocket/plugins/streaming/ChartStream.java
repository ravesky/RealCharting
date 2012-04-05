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
import java.text.SimpleDateFormat;

import java.util.Date;

import javolution.util.FastList;
import javolution.util.FastMap;

import org.apache.log4j.Logger;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;
import org.jwebsocket.token.TokenFactory;

public class ChartStream extends TokenStream {

   private static Logger log = Logging.getLogger(ChartStream.class);
   private Boolean mIsRunning = false;
   private TimerProcess mTimeProcess = null;
   private Thread mTimeThread = null;
   private Connection mConnection = null;
   private SimpleDateFormat simpleDateFormat = null;

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
          Class.forName("com.mysql.jdbc.Driver");
          mConnection = DriverManager.getConnection(
                  "jdbc:mysql://localhost/jWebSocket", "root", "toor");
          
         if (log.isDebugEnabled()) {
               log.debug("Connection with database established...");
           }
      } catch (SQLException lEx) {
         log.error("(sql) " + lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
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

            if (log.isDebugEnabled()) {
               log.debug("Connection closed.");
            }
         }
      } catch (Exception lEx) {
         log.error(lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
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
         simpleDateFormat = new SimpleDateFormat("MMMM dd, yyyy HH:mm:ss");
         
         while (mIsRunning) {
            try {
               Thread.sleep(1000);

               Token lToken = TokenFactory.createToken("event");
               
               lToken.setString("streamID", getStreamID());
               lToken.setString("DATE", simpleDateFormat.format(new Date()));
               
               try {
                  PreparedStatement pSelect = 
                        mConnection.prepareStatement(
                          "SELECT FLIGHT_STATUS, " +
                          "COUNT(FLIGHT_STATUS), " +
                          "ROUND(COUNT(FLIGHT_STATUS)*100/(SELECT COUNT(*) FROM flights),2) " +
                          "FROM flights " +
                          "GROUP BY FLIGHT_STATUS");
                  
                  ResultSet pResult = pSelect.executeQuery();
                  
                  while (pResult.next()) {
                     
                     lToken.setInteger(
                           "CNT_"+ pResult.getString(1) , pResult.getInt(2));
                     lToken.setDouble(
                           "AVE_"+ pResult.getString(1), pResult.getFloat(3));
                  }
                  
                  PreparedStatement pSelect2 = mConnection.prepareStatement(
                		  "SELECT SUM(f.flight_passengers), a.airline_name " +
                		  "FROM FLIGHTS f INNER JOIN AIRLINES a " +
                		  "ON f.airline_id = a.airline_id GROUP BY f.airline_id");
                
                  
                  ResultSet pResult2 = pSelect2.executeQuery();
                  
                  FastList<Object> lList = new FastList<Object>();
                  
                  while (pResult2.next()) {
                	  
                	  FastMap<String,Object> lMap = new FastMap<String,Object>();
                	  lMap.put("airline", pResult2.getString(2));
                	  lMap.put("passengers", pResult2.getInt(1));

                	  lList.add(lMap);      				
                  }
                  
                  lToken.setList("list", lList);
                  
                  log.debug("Chart Streamer Token '" + lToken + "'...");
                          
               } catch (SQLException lEx) {
                  log.error("(sql) " + lEx.getClass().getSimpleName() + ": " + lEx.getMessage());
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
