package models

import java.util.{Date}

import play.api.db._
import play.api.Play.current
import play.api.libs.json._

import anorm._
import anorm.SqlParser._

import java.util.Calendar
import java.util.Date

import scala.language.postfixOps

case class Parkinglot(val _id: String, val name: String, var price: Double, val coorx: Double, 
  val coory: Double, var max: Int, var available: Int, var lastCheck: Date, var reserved: Boolean = false)

object Parkinglot{

  val today = Calendar.getInstance().getTime();

  implicit val ParkinglotWrites = new Writes[Parkinglot] {
    def writes(pl: Parkinglot) = Json.obj(
      "_id" -> pl._id,
      "name" -> pl.name,
      "price" -> pl.price,
      "coorx" -> pl.coorx,
      "coory" -> pl.coory,
      "max" -> pl.max,
      "available" -> pl.available,
      "lastCheck" -> pl.lastCheck.toString,
      "reserved" -> pl.reserved
    )
  }

  // For test
  val parkinglot1 = Parkinglot( "1", "magnolia", 3.23, 52, 23, 100, 20, Calendar.getInstance().getTime(), false);
  val parkinglot2 = Parkinglot( "2", "glen", 3.23, 42, 23, 100, 20, Calendar.getInstance().getTime(), false);

  val json = Json.toJson(Seq(parkinglot1, parkinglot2))

  def show() = json
}

