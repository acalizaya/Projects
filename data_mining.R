install.packages("tidyverse")
install.packages("rtweet")
install.packages("textdata")
install.packages("tidytext")
install.packages("wordcloud")
install.packages("wordcloud2")
install.packages("topicmodels")
install.packages("tm")
install.packages("textrecipes")
install.packages("formattable")
install.packages("broom")
install.packages("ranger")
install.packages("yardstick")
install.packages("SnowballC")
install.packages("syuzhet")


library(tidyverse)
library(rtweet)
library(tidytext)
library(lubridate)
library(textdata)
library(RColorBrewer)
library(wordcloud)
library(wordcloud2)
library(topicmodels)
library(tm)
library(textrecipes)
library(formattable)
library(broom)
library(ranger)
library(yardstick)
library(SnowballC)
library(syuzhet)

data<-search_tweets(
  q="#virtualevents",
  n=10000,
  include_rts = FALSE,
  lang="en",
  retryonratelimit = TRUE
)

data<-data%>%flatten()


#merging and opening all csv files
files<-list.files(pattern="\\.csv$",full.names = TRUE) #read files names with csv
all_data1<-map_df(files, ~read_csv(.x)) #open and merge

#duplicate entries
final_data<-all_data1%>%distinct()
final_data%>%write_csv("final_ve.csv")

tweets<-read_csv("final_ve.csv")

tweets<-
  ve_tweets%>%
  mutate(
    timestamp=ymd_hms(created_at),
    day_of_week=wday(timestamp),
    id=as_factor(row_number())
  )

####removing hashtags, urls, special characters
remove_reg <- "&amp;|&lt;|&gt;|\\d+\\w*\\d*|#\\w+|[^\x01-\x7F]|[[:punct:]]|https\\S*"

tidy_tweets <- tweets %>% 
  filter(!str_detect(text, "^RT")) %>%
  mutate(text = str_remove_all(text, remove_reg))

####sentiment libraries
#afinn<-get_sentiments("afinn")
#bing<-get_sentiments("bing")
#nrc<-get_sentiments("nrc")

#trimming dataset
ve_tweets <- tidy_tweets%>%
  select(text)

head(ve_tweets)

head(tidy_tweets$text)

#removing hashtags, urls, special character
tweets.ve <- gsub("http.*","",tidy_tweets$text)

tweets.ve <- gsub("https.*","",tweets.ve)

tweets.ve <- gsub("#.*","",tweets.ve)

tweets.ve <- gsub("@.*","",tweets.ve)

head(tweets.ve)


#get sentiment for each tweet
word.ve<-as.vector(tweets.ve)

emotion.ve <- get_nrc_sentiment(word.ve)

emotion.ve2<-cbind(tweets.ve,emotion.ve)

head(emotion.ve2)

#sentiment score

sent.value <- get_sentiment(word.ve)
most.positive <- word.ve[sent.value == max(sent.value)]
most.positive

most.negative <- word.ve[sent.value <= min(sent.value)]
most.negative

positive.tweets <- word.ve[sent.value >0]
head(positive.tweets)

negative.tweets <- word.ve[sent.value <0]>
head(negative.tweets)

neutral.tweets <- word.ve[sent.value==0]>
  
  
category_senti <- ifelse(sent.value < 0, "Negative", ifelse(sent.value > 0,"Positive", "Neutral"))  
head(category_senti)

#category_senti2 <- cbind(tidy_tweets$hashtags,tidy_tweets$text,category_senti)
#head(category_senti2)

category_senti4 <- cbind(tidy_tweets$created_at,tidy_tweets$text,tidy_tweets$retweet_count,tidy_tweets$favourites_count,tidy_tweets$hashtags,tidy_tweets$media_expanded_url,category_senti,emotion.ve2)
head(category_senti4)

tidy_senti4 <- category_senti4 %>%
  select(`tidy_tweets$created_at`,`tidy_tweets$text`,`tidy_tweets$retweet_count`,`tidy_tweets$favourites_count`,`tidy_tweets$hashtags`,`tidy_tweets$media_expanded_url`,`tweets.ve`,category_senti,anger,anticipation,disgust,fear,joy,sadness, surprise, trust,negative,positive)
tidy_senti4%>%
  head()

category_senti.df <- as.data.frame(tidy_senti4)

names(category_senti.df)[1]<- 'created_at'
names(category_senti.df)[2]<- 'text'
names(category_senti.df)[3]<- 'retweet_count'
names(category_senti.df)[4]<- 'favourites_count'
names(category_senti.df)[5]<- 'hashtags'
names(category_senti.df)[6]<- 'url'


category_senti.df%>%write_csv("category_senti_ve.csv")

  

#table(category_senti)
#category_sentiment.df <- as.data.frame(category_senti2)
#category_sentiment.df%>%write_csv("category_sentiment_ve.csv")
#emotion.ve2%>%write_csv("emotions_ve.csv")


#category_senti2<-category_senti2%>%flatten()
#category_senti2%>%write_csv("category_sentiment_ve.csv")


#trimmed_tweets <- tidy_tweets %>%
  #select(user_id,status_id,created_at,text,screen_name,source,display_text_width,
         #favourites_count,retweet_count,reply_count,hashtags,place_name,
         #place_full_name,place_type,country,location,description,followers_count,
         #friends_count,listed_count,statuses_count,favourites_count, account_created_at,
         #verified,timestamp)
#trimmed_tweets%>%
  #head()