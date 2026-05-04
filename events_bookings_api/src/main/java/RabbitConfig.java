
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // The name of our mailbox
    public static final String QUEUE_NAME = "venue-booking-queue";

    // 1. Create the Queue (true = durable, it survives a restart)
    @Bean
    public Queue queue() {
        return new Queue(QUEUE_NAME, true);
    }

    // 2. Tell RabbitMQ to expect JSON instead of weird Java byte code
    @SuppressWarnings("removal")
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // 3. Link the JSON converter to our template
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}