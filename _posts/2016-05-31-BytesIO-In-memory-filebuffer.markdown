---
published: true
date: 2016-05-31 09:37:00 +0600
title: "BytesIO: In-memory filebuffer"
layout: post
tags: ["python", "যন্ত্রচারী", "প্রোগ্রামিঙ"]
comments: true
excerpt_separator: <!--more-->
---
যারা মোটামুটি ভালোমানের টেক্সট এডিটর(Vim, Emacs, Atom, Sublime etc.) ব্যবহার করে আসছেন তারা ফাইল(file) ও বাফার(buffer) এর মধ্যে পার্থক্য জানেন। বাফার হচ্ছে সহজ কথায় মেমরিতে লোড করা ফাইল। পাইথনে এমন বাফার হিসেবে ব্যবহার করা যায় বিল্ট-ইন `io` লাইব্রেরির `BytesIO` মেথডটি[^1]। এখন প্রশ্ন হচ্ছে কখন ব্যবহার করবো? তখনই ব্যবহার করবো যখন আমার একখণ্ড ডাটা প্রয়োজন যা ফাইলের মত আচরণ করবে। মনে করুন আমরা একটা QRCode Generator বানাচ্ছি। আসলে বেশ কয়েকটা QRCode generator library আছে ইতমধ্যে। আমাদের যা প্রয়োজন তা হচ্ছে আমরা QRCode-টিকে একটা 1.91:1 অনুপাতের ব্যাকগ্রাউন্ডের মাঝখানে রাখবো। সাধারনভাবে আমরা যা করতে পারি তা হচ্ছে একটা QRCode ছবি তৈরী করবো, তারপর `PIL` লাইব্রেরি দিয়ে একটি ব্যাকগ্রাউন্ড তৈরী করে তার ওপর আগের বানানো ছবি থেকে রিড করে বসিয়ে দেবো। এক্ষেত্রে আসলে দুটো ফাইল তৈরী হবে যার একটি অপ্রয়োজনীয়।

And then... BytesIO steps in to save the day... :smile:
<!--more-->
আমাদের দুটো লাইব্রেরি লাগবে, ইন্সটলড্ না থাকলে `pip` দিয়ে ইন্সটল করে নেন। লাইব্রেরিগুলো হচ্ছে `qrcode` ও `Pillow`।

তো প্রথমে আমরা একটা QRCode তৈরী করবো:

{% highlight python %}
import qrcode

data = "https://uroybd.github.io"
# QRCode definition
qcode = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=8,
    border=0,
)
qcode.add_data(data)
qcode.make(fit=True)
# Image Generate করলাম
qrimage = qcode.make_image()
{% endhighlight %}

আমরা এটিকে এখন একটা ফাইলে সেভ করতে পারি(কিন্তু করবো না) এভাবে:
{% highlight python %}
with open("qcode.png", "w") as dfile:
    qrimage.save(dfile)
{% endhighlight %}

তার বদলে আমরা একটি বাফার তৈরী করে তাতে ডাটা রাখবো যেন এটিকে ফাইলের মতই ব্যবহার করা যায়:

{% highlight python %}
from io import BytesIO
# Python 2 তে from StringIO import StringIO

# একটা বাফার তৈরী করি QRCode এর ডাটা রাখতে
buffer = BytesIO()
qrimage.save(buffer)  # বাফারে সেভ করি
{% endhighlight %}

এখন এই বাফারটিকে আমরা ফাইলের মতই ব্যবহার করতে পারবো। ব্যাকগ্রাউন্ড যোগ করা যাক:

{% highlight python %}
from PIL import Image

image = Image.open(buffer, 'r')
image_w, image_h = image.size
background = Image.new('RGBA', (191*2, 100*2), (255, 255, 255, 255))
bg_w, bg_h = background.size
offset = (int((bg_w - image_w) / 2), int((bg_h - image_h) / 2))
background.paste(image, offset)
background.save(filename, format="png")  # ফাইলে সেভ করি
{% endhighlight %}

এখন আমরা এটাকে যদি একটি ফাংশনে রূপ দিই তবে সব মিলে দাঁড়াচ্ছে:

{% highlight python %}
def gen_custom_qrcode(data, filename):
    # QRCode definition
    qcode = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=8,
        border=0,
    )
    qcode.add_data(data)
    qcode.make(fit=True)

    qrimage = qcode.make_image()
    buffer = BytesIO()
    qrimage.save(buffer)
	# বাফারটিকে ফাইল হিসেবে খুলি
    image = Image.open(buffer, 'r')
    image_w, image_h = image.size
    background = Image.new('RGBA', (191*2, 100*2), (255, 255, 255, 255))
    bg_w, bg_h = background.size
    # QRCode মাঝখানে বসানোর জন্য অফসেটের মান
    offset = (int((bg_w - image_w) / 2), int((bg_h - image_h) / 2))
    background.paste(image, offset)
    background.save(filename, format="png")
{% endhighlight %}

এখন আমরা `gen_custom_qrcode` ফাংশনটি ব্যবহার করে ডাটা ও আউটপুট ফাইলনেম আর্গুমেন্ট হিসেবে ব্যবহার করে আমাদের কাস্টম QRCode generate করতে পারবো। মধ্যবর্তী কোনো ফাইল ছাড়াই।

বাস্তবজগতে একটা ব্যবহার বলি। আপনি প্রোগামিটিক্যালি QRCode বা যেকোনো ফাইল জেনারেট করে বাফারে সেভ করে সেটা থেকে [InMemoryUploadedFile](https://docs.djangoproject.com/en/1.9/ref/files/uploads/) দিয়ে জ্যাঙ্গোর মডেলে সরাসরি আপলোড দিতে পারেন, ব্যবহার করতে পারেন প্রয়োজনমত। মাঝখানে একটা ফাইল জেনারেট করা, সেটা আপলোড ও পুরোনো ফাইল ডিলিটের ঝামেলায় পড়তে হবে না।

[^1]: Python 2-তে আপনাকে `StringIO` লাইব্রেরির `StringIO` মেথডটি ব্যবহার করতে হবে।
