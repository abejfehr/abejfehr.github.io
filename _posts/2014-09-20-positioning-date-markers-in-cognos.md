---
layout: post
title: Positioning date markers in Cognos BI
date:   2014-09-20 12:00:00
categories: posts
description: This is a guide which aims to teach how to position markers relative to a date in a Cognos Business Intelligence chart
---

The charting engine in [Cognos BI](http://www-03.ibm.com/software/products/en/business-intelligence/) offers its users tons of customizability when visualizing their data. One of the most underrated features of these Cognos charts is *markers*. Markers are designed for representing particular points in a chart, as described in [the documentation](https://www-01.ibm.com/support/knowledgecenter/SSEP7J_10.2.1/com.ibm.swg.ba.cognos.ug_cr_rptstd.10.2.1.doc/c_add_markers_charts.html?lang=en).

Note that in the documentation it says the following:

> "...you might want to add a marker to designate the time when a significant event happened, such as the date when a new product was launched."

It turns out that doing so is slightly more challenging than it should be, so this article has been designed to provide insight on how you can position markers to denote a specific date on a chart.

## Preparing the report

Chart markers can only work in combination, progressive column, [Pareto](https://en.wikipedia.org/wiki/Pareto_chart), scatter, and bubble charts. In our example, we'll create a report that has a *combination chart*, using the [samples provided by IBM](https://www-01.ibm.com/support/knowledgecenter/SSEP7J_10.2.1/com.ibm.swg.ba.cognos.ig_smples.10.2.1.doc/c_cognos_samples_overview.html?lang=en).

Open up Report Studio and let's choose the **GO Sales (query)** package. We'll also be creating our new report using the chart template.

Go ahead and select the first Combination Chart in the list with the defaults.

![Combination Chart with default settings](../../../../images/2014-09-20/1.png "Combination Chart with default settings")

Right off the bat we can delete the bar series from the chart. For this example we'll only need the line series.

We'll be using the following Data Items from the Sales (query) namespace:

- **Date**,  from the *Time* folder. Drag this into the *Categories (x-axis)* area of the chart
- **Revenue**, from the *Sales* folder. Drag this into the chart as a *Series*.

After dragging in the above data items, your chart should look like the one in the image below.

![Chart with the data items](../../../../images/2014-09-20/2.png "Chart with the data items")

Now we've created a simple chart that runs. Only the series and the x-axis are required to graph relationships in Cognos.

Currently we have two problems if we run our report:

1. There are way too many dates in the chart
2. There's no data item that denotes where we'll be placing the marker

To solve problem one, we'll create a filter for our data. Open up the **Query Explorer** and click on *Query1*.

From the **Toolbox**, let's drag a Filter into the **Detail Filters** pane. We can make the filter so it only shows dates from near our (fictional) product's release date:

![Date filter](../../../../images/2014-09-20/3.png "Date filter")

Against from the **Toolbox**, drag in a new data item. Let's call the data item *Release Date*, and give it the following expression:

![Release date data item](../../../../images/2014-09-20/4.png "Release date data item")

## Adding the marker

The last thing we need is another data item(besides [Release Date]) to help us position the marker.

We'll name it *Release Date Marker* and it'll be used to position the marker relative to [Release Date] and [Revenue]. Give it the following expression:

    if([Date]=[Release Date]) then ([Revenue]) else (null)
<br />
All this does is try to return a value for each date. What value is returned? If the date is the release date, it returns the [Revenue] for that day. Otherwise, it returns *null*.

Let's add a new marker by selecting the chart and clicking the ellipses next to the *Markers* property in the **Properties** pane.

Add the new marker and make both the Category Position and the Numeric Position refer to the *Release Date Marker* Data Item that we created earlier, based on a **Layout Calculation**.

![Marker properties](../../../../images/2014-09-20/5.png "Marker properties")

Here you can be as creative as you want with the styling options. I'll choose to make my marker an orange star with 5 points.

Are we finished? Not quite...

If we were to run the report now, it would fail. We get the CRX-API-0005 error because we're not allowed to use [Release Date Marker] in the Layout Calculation if it's not in the chart.

![Cognos error](../../../../images/2014-09-20/6.png "Cognos error")

In order to circumvent this silly error, we'll have to reference [Release Date Marker] somewhere in the chart. We could add it to the chart as a series, but that would lead to having an extra entry in the legend of the chart. Instead, let's utilize the *Properties* property.

Select the <#Date#> category item in the chart and click the ellipses next to the Properties property. This brings up a small window with a list of the data items in the query. Let's select *Release Date Marker* and click OK.

![Properties box](../../../../images/2014-09-20/7.png "Properties box")

Click on run once again, and this time we're greeted with a beautiful, *marked* chart!

![Resulting chart](../../../../images/2014-09-20/8.png "Resulting chart")

## Conclusion

Markers are a great way to draw attention to certain points of data on a chart. The documentation states that they can be used to mark dates, but doesn't provide clear instructions on how to do that. By creating a data item that only returns a value on a particular date, we can map the marker's location to that data item and display our marker at a custom location.