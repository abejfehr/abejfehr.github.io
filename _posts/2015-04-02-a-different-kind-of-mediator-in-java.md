---
layout: post
title: A different kind of mediator in Java
date:   2015-04-02 12:00:00
categories: posts
description:
---

In a recent Software Engineering class, my professor taught the Mediator design pattern in Java. I had seen this design pattern before in Addy Osmani's post about [large-scale JavaScript applications](http://addyosmani.com/largescalejavascript/) and I ended up using it for a project. That was the Mediator I knew and loved.

In Java, the examples weren't nearly as elegant as what I'd seen in JavaScript and I almost found them confusing and unhelpful. To me, the flexibility of passing messages to a mediator and having modules that susbcribed to them was the most beautiful thing I'd ever seen.

![UML for my mediator pattern in Java][my-java-mediator-uml]

# The Code

## Mediator

All that the mediator needs to do is keep a list of who's subscribing to which channels, and notify the subscribers when necessary.

{% highlight java %}
    package mediatorTest;

    import java.util.ArrayList;
    import java.util.HashMap;

    public class Mediator {

    	HashMap<String, ArrayList<Subscriber>> subscribers;

    	Mediator() {
    		subscribers = new HashMap<String, ArrayList<Subscriber>>();
    	}

    	public synchronized void subscribe(Subscriber subscriber, String channel) {
    		ArrayList<Subscriber> channelSubs = subscribers.get(channel);
    		if(channelSubs == null) {
    			channelSubs = new ArrayList<Subscriber>();
    		}
    		channelSubs.add(subscriber);
    		subscribers.put(channel, channelSubs);
    	}

    	public void publish(String channel) {
    		ArrayList<Subscriber> subs = subscribers.get(channel);
    		if(subs == null) { return; }
    		for(Subscriber sub : subs) {
    			sub.execute(channel);
    		}
    	}

    }
{% endhighlight %}

## Subscriber.java

{% highlight java %}

    package mediatorTest;

    public abstract class Subscriber {

    	private Mediator mediator;

    	Subscriber(Mediator m) {
    		mediator = m;
    	}

    	public void subscribe(String channel) {
    		mediator.subscribe(this, channel);
    	}

    	public void publish(String channel) {
    		mediator.publish(channel);
    	}

    	public abstract void execute(String channel);
    }
{% endhighlight %}

## Person.java

This is simply a concrete implementation of the abstract subscriber class.

{% highlight java %}

    package mediatorTest;

    public class Person extends Subscriber {

    	private String name;

    	Person(String n, Mediator m) {
    		super(m);
    		name = n;
    	}

    	@Override
    	public void execute(String channel) {
    		switch(channel) {
    			case "ICE CREAM FOR SALE":
    				jumpForJoy("his love for ice cream");
    				break;
    			case "APPLE PIE FOR SALE":
    				jumpForJoy("pie is awesome");
    				break;
    		}
    	}

    	private void jumpForJoy(String reason) {
    		System.out.println(name + " is jumping for joy because of " + reason + "!");
    	}

    }
{% endhighlight %}


And finally...

## Main.java

{% highlight java %}

    package mediatorTest;

    public class Main {

    	public static void main(String[] args) {

    		Mediator mediator = new Mediator();

    		Person john = new Person("John", mediator);
    		Person abe = new Person("Abe", mediator);
    		Person iceCreamSalesman = new Person("Ice Cream Guy", mediator);
    		Person applePieSalesman = new Person("Apple Pie Guy", mediator);

    		abe.subscribe("ICE CREAM FOR SALE");
    		john.subscribe("ICE CREAM FOR SALE");
    		abe.subscribe("APPLE PIE FOR SALE");

    		iceCreamSalesman.publish("ICE CREAM FOR SALE");
    		applePieSalesman.publish("APPLE PIE FOR SALE");

    		abe.publish("THIS IS A NONSENSE MESSAGE!");
    	}

    }
{% endhighlight %}

# Potential Problems

**No anonymous functions.** The beauty of JavaScript is that you can create a function inline as the argument for a subscription to a channel. This is something that's not as easily possible with Java.

**Passing objects while publishing.** It's nice that in Addy's implementation of the Mediator you can pass arguments in addition to the message being published. Again, I don't know if this is something that can be done with Java. Even if it can, I'm sure the final result wouldn't look much like Java at all.

**Objects exist forever.** There's nothing in the Mediator that handles the removal of objects, so even if they're reassigned their still called on to `execute()` when it's their time.

# Conclusion

By no means is the design mentioned here perfect &mdash; I haven't even had the chance to test this properly yet. I'm sure that there must be more problems in addition to the ones posted above, but this is simply intended to (hopefully) inspire someone out there to design something else cool.

Something profoundly similar might already exist somewhere known by a different name. If anyone could comment on this to let me know, that would be great!

[my-java-mediator-uml]: ../../../../images/2015-04-02/my-java-mediator-uml.png "UML for my mediator pattern in Java"