package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import scala.concurrent.Future

// Reactive Mongo imports
import reactivemongo.api._

// Reactive Mongo plugin, including the JSON-specialized collection
import play.modules.reactivemongo.MongoController
import play.modules.reactivemongo.json.collection.JSONCollection
import scala.util.{Failure, Success}

import anorm._

import views._
import models._

import models.Parkinglot._

/**
 * Manage a database of parkinglots
 */
object Application extends Controller with MongoController{ 

  def collection: JSONCollection = db.collection[JSONCollection]("parkinglots")


  def createObject = Action.async {
    // insert the user
    val futureResult = collection.insert(Parkinglot.parkinglot1)
    // when the insert is performed, send a OK 200 result
    futureResult.map(_ => Ok)
  }

  def findByName(name: String) = Action.async {
    // let's do our query
    val cursor: Cursor[JsObject] = collection.
      // find all people with name `name`
      find(Json.obj("name" -> name)).
      // perform the query and get a cursor of JsObject
      cursor[JsObject]

    // gather all the JsObjects in a list
    val futurePersonsList: Future[List[JsObject]] = cursor.collect[List]()

    // transform the list into a JsArray
    val futurePersonsJsonArray: Future[JsArray] = futurePersonsList.map { persons =>
      Json.arr(persons)
    }

    // everything's ok! Let's reply with the array
    futurePersonsJsonArray.map { persons =>
      Ok(persons)
    }
  }

  def findAll(username: String, radius: Double) = Action.async {
    // let's do our query
    val cursor: Cursor[JsObject] = collection.find(Json.obj()).
      // perform the query and get a cursor of JsObject
      cursor[JsObject]

    // gather all the JsObjects in a list
    val futurePersonsList: Future[List[JsObject]] = cursor.collect[List]()

    // transform the list into a JsArray
    val futurePersonsJsonArray: Future[JsArray] = futurePersonsList.map { pl =>
      Json.arr(pl)
    }

    // everything's ok! Let's reply with the array
    futurePersonsJsonArray.map { pl =>
      Ok(pl)
    }
  }


  /**
   * This result directly redirect to the application home.
   * This is called reverse URL directing
   */
  val Home = Redirect(routes.Application.newHome)
  
  
  // -- Actions

  /**
   * Handle default path requests, redirect to computers list
   */  
  def index = Action { Home  }
  
  def newHome = Action { implicit request =>
    Ok(html.main())
  }


  def reserve(parkID: Int, username: String) = Action{
    // let's do our query
    println("reserve" + " parkID = " + parkID);

    val positiveParkID = scala.math.abs(parkID);

    val cursor: Cursor[JsObject] = collection.
      find(Json.obj("_id" -> positiveParkID.toString)).
      cursor[JsObject]

    
  	val futurePersonsList: Future[List[JsObject]] = cursor.collect[List]()
    
    // transform the list into a JsArray
    val futurePersonsJsonArray: Future[JsArray] = futurePersonsList.map { pl =>
      Json.arr(pl)
    }

    futurePersonsJsonArray.foreach { pl =>
      val arr = pl \\ "available"
			val addOne = arr(0).as[Int] + 1;
			val removeOne = arr(0).as[Int] - 1;

			var modifier: JsObject = null;
			if(parkID >= 0){
  			modifier = Json.obj(
				  "$set" -> Json.obj(
				    "available" -> addOne)
				)
  		}
			else{
  			modifier = Json.obj(
				  "$set" -> Json.obj(
				    "available" -> removeOne)
				)
  		}
  		collection.update(Json.obj("_id" -> positiveParkID.toString), modifier).onComplete{
			  case Failure(e) => throw e
			  case Success(_) => println("successful update!")
  		}

    }

    Ok(html.main())
  }

}
            
